import { z } from 'zod';

const optionalUrl = z.string().url('URL inválida').optional().or(z.literal(''));
export const profileCreateSchema = z.object({ name: z.string().trim().min(2), email: z.string().email(), bio: z.string().trim().max(500).optional(), avatarUrl: optionalUrl });
export const technologyCreateSchema = z.object({ name: z.string().trim().min(2), category: z.string().trim().max(80).optional() });
export const projectCreateSchema = z.object({ title: z.string().trim().min(3), description: z.string().trim().min(10), repositoryUrl: optionalUrl, deployUrl: optionalUrl, profileId: z.coerce.number().int().positive(), technologyIds: z.array(z.coerce.number().int().positive()).default([]) });
export const feedbackCreateSchema = z.object({ rating: z.coerce.number().int().min(1).max(5), comment: z.string().trim().min(1).max(1000), author: z.string().trim().min(2).max(100).optional().default('Anônimo') });
export const projectListQuerySchema = z.object({ technologyId: z.coerce.number().int().positive().optional(), technology: z.string().trim().min(1).optional(), page: z.coerce.number().int().positive().default(1), limit: z.coerce.number().int().positive().max(100).default(10) });
export const idSchema = z.coerce.number().int().positive();

export type FeedbackCreateInput = z.infer<typeof feedbackCreateSchema>;
export type ProjectListQuery = z.infer<typeof projectListQuerySchema>;
