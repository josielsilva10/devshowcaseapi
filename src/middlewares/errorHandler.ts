import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: 'Dados inválidos', message: 'Confira os campos enviados.', details: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message })) });
  }
  const err = error as { code?: string; type?: string; status?: number; message?: string };
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido', message: 'O corpo da requisição não contém um JSON válido.' });
  if (err?.code === 'P2002') return res.status(409).json({ error: 'Registro duplicado', message: 'Já existe um registro com esse valor.' });
  if (err?.code === 'P2025') return res.status(404).json({ error: 'Não encontrado', message: 'O registro solicitado não foi encontrado.' });
  if (err?.code === 'P2003') return res.status(400).json({ error: 'Referência inválida', message: 'Um dos registros relacionados não existe.' });
  if (err?.status === 400) return res.status(400).json({ error: 'Requisição inválida', message: err.message || 'Confira os dados enviados.' });
  console.error(error);
  return res.status(500).json({ error: 'Erro interno', message: 'Ocorreu um erro inesperado no servidor.' });
}
