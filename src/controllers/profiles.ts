import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { idSchema, profileCreateSchema } from '../schemas';

export async function createProfile(req: Request, res: Response) {
  const data = profileCreateSchema.parse(req.body);
  const profile = await prisma.profile.create({ data, include: { projects: true } });
  return res.status(201).json(profile);
}

export async function getProfile(req: Request, res: Response) {
  const id = idSchema.parse(req.params.id);
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: { projects: { include: { technologies: { include: { technology: true } }, feedbacks: true } } }
  });
  if (!profile) return res.status(404).json({ error: 'Não encontrado', message: `Perfil ${id} não encontrado.` });
  return res.json(profile);
}
