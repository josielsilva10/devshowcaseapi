import { Router } from 'express';
import { createProfile, getProfile } from '../controllers/profiles';
import { createTechnology, listTechnologies } from '../controllers/technologies';
import { createProject, listProjects } from '../controllers/projects';

export const router = Router();
router.post('/profiles', createProfile);
router.get('/profiles/:id', getProfile);
router.post('/technologies', createTechnology);
router.get('/technologies', listTechnologies);
router.post('/projects', createProject);
router.get('/projects', listProjects);
