import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';

let profileId: number;
let technologyId: number;
let projectId: number;

beforeAll(async () => {
  await prisma.projectTechnology.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.profile.deleteMany();
  const profile = await prisma.profile.create({ data: { name: 'Ana Dev', email: 'ana@example.com' } });
  const technology = await prisma.technology.create({ data: { name: 'TypeScript', category: 'Linguagem' } });
  const project = await prisma.project.create({
    data: { title: 'Showcase', description: 'Projeto de demonstração da API', profileId: profile.id, technologies: { create: [{ technologyId: technology.id }] } }
  });
  profileId = profile.id;
  technologyId = technology.id;
  projectId = project.id;
});

afterAll(async () => { await prisma.$disconnect(); });

describe('DevShowcase API — etapa final', () => {
  it('lista projetos com paginação e filtro de tecnologia', async () => {
    const all = await request(app).get('/api/projects?page=1&limit=5');
    expect(all.status).toBe(200);
    expect(all.body.data).toHaveLength(1);
    expect(all.body.pagination).toMatchObject({ page: 1, limit: 5, total: 1, totalPages: 1 });
    const filtered = await request(app).get(`/api/projects?technologyId=${technologyId}`);
    expect(filtered.status).toBe(200);
    expect(filtered.body.data[0].id).toBe(projectId);
    expect((await request(app).get('/api/projects?limit=0')).status).toBe(400);
  });

  it('cria feedback e recalcula a média do projeto', async () => {
    const first = await request(app).post(`/api/projects/${projectId}/feedbacks`).send({ rating: 5, comment: 'Excelente projeto', author: 'João' });
    expect(first.status).toBe(201);
    expect(first.body.project.averageRating).toBe(5);
    const second = await request(app).post(`/api/projects/${projectId}/feedbacks`).send({ rating: 3, comment: 'Muito bom' });
    expect(second.status).toBe(201);
    expect(second.body.project.averageRating).toBe(4);
    const invalid = await request(app).post(`/api/projects/${projectId}/feedbacks`).send({ rating: 8, comment: '' });
    expect(invalid.status).toBe(400);
    expect(invalid.body).toHaveProperty('message');
  });

  it('incrementa upvotes e retorna 404 para projeto inexistente', async () => {
    expect((await request(app).put(`/api/projects/${projectId}/upvote`)).body.upvotes).toBe(1);
    expect((await request(app).put(`/api/projects/${projectId}/upvote`)).body.upvotes).toBe(2);
    const missing = await request(app).put('/api/projects/999999/upvote');
    expect(missing.status).toBe(404);
    expect(missing.body.error).toBe('Não encontrado');
  });

  it('formata o erro 404 e disponibiliza OpenAPI/Swagger', async () => {
    const missing = await request(app).get('/rota-inexistente');
    expect(missing.status).toBe(404);
    expect(missing.body).toMatchObject({ error: 'Não encontrado' });
    const spec = await request(app).get('/api-docs.json');
    expect(spec.status).toBe(200);
    expect(spec.body.paths['/api/projects/{id}/upvote']).toBeDefined();
    expect((await request(app).get('/api-docs/')).status).toBe(200);
  });

  it('mantém a criação inválida de perfil como 400 amigável', async () => {
    const invalid = await request(app).post('/api/profiles').send({ name: '', email: 'email-inválido' });
    expect(invalid.status).toBe(400);
    expect(invalid.body.error).toBe('Dados inválidos');
    expect(invalid.body.details).toBeInstanceOf(Array);
  });
});

