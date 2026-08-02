import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'crypto';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import 'express-async-errors';

import { logger } from './lib/logger.js';
import { appConfig } from './config/app.js';
import apiRouter from './routes/index.js';
import healthRouter from './modules/health/health.routes.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Disable standard Header advertising Express
app.disable('x-powered-by');

// Enable trust proxy (required behind Caddy/Nginx)
app.set('trust proxy', 1);

// Generate and attach Request ID
app.use((req, res, next) => {
  const reqId = (req.headers['x-request-id'] as string) || randomUUID();
  req.headers['x-request-id'] = reqId;
  res.setHeader('X-Request-ID', reqId);
  next();
});

// Configure request logger
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers['x-request-id'] as string,
    customProps: (req) => ({
      reqId: req.headers['x-request-id'],
    }),
    autoLogging: {
      ignore: (req) => req.url === '/health' || req.url === '/health/ready',
    },
  })
);

// Standard security and parsing middlewares
app.use(helmet());
app.use(
  cors({
    origin: appConfig.cors.origins,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Expose root health check endpoints (liveness & readiness)
app.use('/health', healthRouter);

// OpenAPI Swagger configuration
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RaktSetu API API Documentation',
      version: '1.0.0',
      description: 'REST API service for RaktSetu Real-Time Blood Donation Engine',
    },
    servers: [
      {
        url: `http://localhost:${appConfig.port}/api/v1`,
        description: 'Local development server',
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/routes/**/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount main versioned endpoints
app.use(appConfig.apiPrefix, apiRouter);

// Global error handler (handles AppError, ZodErrors, and standard runtime issues)
app.use(errorHandler);

export default app;
