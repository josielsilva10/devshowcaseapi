import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { projectCreateSchema } from '../schemas';

const projectInclude = { profile: true, technologies: { include: { technology: true } }, feedbacks: true } as const;

export async function createProject(req: Request, res: Response) {
  const { technologyIds, ...data } = projectCreateSchema.parse(req.body);
  const project = await prisma.project.create({
    data: {
      ...data,
      technologies: { create: technologyIds.map((technologyId) => ({ technology: { connect: { id: technologyId } } })) }
    },
    include: projectInclude
  });
  return res.status(201).json(project);
}

export async function listProjects(_req: Request, res: Response) {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' }, include: projectInclude });
  return res.json(projects);
}
