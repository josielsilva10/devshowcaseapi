import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: 'Dados inválidos', details: error.issues });
  }
  const prismaError = error as { code?: string };
  if (prismaError?.code === 'P2002') return res.status(409).json({ error: 'Registro duplicado' });
  if (prismaError?.code === 'P2025') return res.status(404).json({ error: 'Registro relacionado não encontrado' });
  console.error(error);
  return res.status(500).json({ error: 'Erro interno do servidor' });
}
