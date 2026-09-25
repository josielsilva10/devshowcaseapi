import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { router } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { openApiSpec } from './openapi';

export const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'devshowcaseapi' }));
app.get('/api-docs.json', (_req, res) => res.json(openApiSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
app.use('/api', router);
app.use((_req, res) => res.status(404).json({ error: 'Não encontrado', message: 'A rota solicitada não existe.' }));
app.use(errorHandler);
