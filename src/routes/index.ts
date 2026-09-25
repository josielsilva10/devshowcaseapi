import { Router } from 'express';
import { createProfile, getProfile } from '../controllers/profiles';
import { createTechnology, listTechnologies } from '../controllers/technologies';
import { createFeedback, createProject, listProjects, upvoteProject } from '../controllers/projects';

export const router = Router();
router.post('/profiles', createProfile);
router.get('/profiles/:id', getProfile);
router.post('/technologies', createTechnology);
router.get('/technologies', listTechnologies);
router.post('/projects', createProject);
router.get('/projects', listProjects);
router.post('/projects/:id/feedbacks', createFeedback);
router.put('/projects/:id/upvote', upvoteProject);
