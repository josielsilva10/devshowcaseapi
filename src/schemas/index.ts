import { z } from 'zod';

const optionalUrl = z.string().url().optional().or(z.literal(''));

export const profileCreateSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  bio: z.string().trim().max(500).optional(),
  avatarUrl: optionalUrl
});

export const technologyCreateSchema = z.object({
  name: z.string().trim().min(2, 'Nome da tecnologia é obrigatório'),
  category: z.string().trim().max(80).optional()
});

export const projectCreateSchema = z.object({
  title: z.string().trim().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().trim().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  repositoryUrl: optionalUrl,
  deployUrl: optionalUrl,
  profileId: z.coerce.number().int().positive('profileId deve ser positivo'),
  technologyIds: z.array(z.coerce.number().int().positive()).default([])
});

export const idSchema = z.coerce.number().int().positive();
