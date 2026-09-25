import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { feedbackCreateSchema, projectCreateSchema, projectListQuerySchema, idSchema } from '../schemas';

const projectInclude = { profile: true, technologies: { include: { technology: true } }, feedbacks: true } as const;

export async function createProject(req: Request, res: Response) {
  const { technologyIds, ...data } = projectCreateSchema.parse(req.body);
  const project = await prisma.project.create({
    data: { ...data, technologies: { create: technologyIds.map((technologyId) => ({ technology: { connect: { id: technologyId } } })) } },
    include: projectInclude
  });
  return res.status(201).json(project);
}

export async function listProjects(req: Request, res: Response) {
  const { technologyId, technology, page, limit } = projectListQuerySchema.parse(req.query);
  const where = technologyId
    ? { technologies: { some: { technologyId } } }
    : technology ? { technologies: { some: { technology: { name: technology } } } } : {};
  const [data, total] = await prisma.$transaction([
    prisma.project.findMany({ where, orderBy: { createdAt: 'desc' }, include: projectInclude, skip: (page - 1) * limit, take: limit }),
    prisma.project.count({ where })
  ]);
  return res.json({ data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
}

export async function createFeedback(req: Request, res: Response) {
  const projectId = idSchema.parse(req.params.id);
  const input = feedbackCreateSchema.parse(req.body);
  const result = await prisma.$transaction(async (tx) => {
    if (!(await tx.project.findUnique({ where: { id: projectId } }))) return null;
    const feedback = await tx.feedback.create({ data: { ...input, projectId } });
    const aggregate = await tx.feedback.aggregate({ where: { projectId }, _avg: { rating: true } });
    const project = await tx.project.update({ where: { id: projectId }, data: { averageRating: aggregate._avg.rating ?? 0 } });
    return { feedback, project };
  });
  if (!result) return res.status(404).json({ error: 'Não encontrado', message: `Projeto ${projectId} não encontrado` });
  return res.status(201).json(result);
}

export async function upvoteProject(req: Request, res: Response) {
  const projectId = idSchema.parse(req.params.id);
  const project = await prisma.project.update({ where: { id: projectId }, data: { upvotes: { increment: 1 } }, include: projectInclude });
  return res.json(project);
}
