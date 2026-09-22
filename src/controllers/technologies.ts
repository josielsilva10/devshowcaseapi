import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { technologyCreateSchema } from '../schemas';

export async function createTechnology(req: Request, res: Response) {
  const data = technologyCreateSchema.parse(req.body);
  const technology = await prisma.technology.create({ data });
  return res.status(201).json(technology);
}

export async function listTechnologies(_req: Request, res: Response) {
  const technologies = await prisma.technology.findMany({ orderBy: { name: 'asc' } });
  return res.json(technologies);
}
