import request from 'supertest';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';

beforeAll(async () => {
  await prisma.projectTechnology.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.project.deleteMany();
  await prisma.technology.deleteMany();
  await prisma.profile.deleteMany();
});
afterAll(async () => { await prisma.$disconnect(); });

describe('DevShowcase API', () => {
  it('cria e consulta perfil', async () => {
    const created = await request(app).post('/api/profiles').send({ name: 'Ana Dev', email: 'ana@example.com', bio: 'Backend developer' });
    expect(created.status).toBe(201);
    const found = await request(app).get(`/api/profiles/${created.body.id}`);
    expect(found.status).toBe(200);
    expect(found.body.email).toBe('ana@example.com');
  });

  it('valida perfil inválido', async () => {
    const response = await request(app).post('/api/profiles').send({ name: '', email: 'invalido' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Dados inválidos');
  });

  it('cria/lista tecnologia e cria/lista projeto com relacionamento', async () => {
    const profile = await prisma.profile.findFirstOrThrow();
    const tech = await request(app).post('/api/technologies').send({ name: 'TypeScript', category: 'Linguagem' });
    expect(tech.status).toBe(201);
    const listedTechs = await request(app).get('/api/technologies');
    expect(listedTechs.status).toBe(200);
    const project = await request(app).post('/api/projects').send({ title: 'Showcase', description: 'Projeto de demonstração da API', profileId: profile.id, technologyIds: [tech.body.id], repositoryUrl: 'https://github.com/exemplo/showcase' });
    expect(project.status).toBe(201);
    expect(project.body.technologies[0].technology.name).toBe('TypeScript');
    const projects = await request(app).get('/api/projects');
    expect(projects.status).toBe(200);
    expect(projects.body).toHaveLength(1);
  });
});
