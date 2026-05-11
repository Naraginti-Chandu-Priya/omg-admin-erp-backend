import { Server, reportDebug, SecretManagerOptions } from 'node-server-engine';
import * as cookieParser from 'cookie-parser';
import * as endpoints from '../endpoints';
import { authMiddleware } from '../middlewares/global.middleware';

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';

const swaggerFilePath = path.resolve(__dirname, '../../docs/index.yaml');
const swaggerContent = fs.readFileSync(swaggerFilePath, 'utf8');
const swaggerDocument = yaml.load(swaggerContent) as Record<string, unknown>;

reportDebug.setNameSpace('~~namespace~~');

export function createServer(): Server {
  const app = express();

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  const secretManagerConfig: SecretManagerOptions = {
    enabled: process.env.NODE_ENV === 'production',
    projectId: process.env.GCP_PROJECT_ID,
    cache: true,
    fallbackToEnv: true,
    secrets: [
      // Example: Load string secrets directly as environment variables
      // 'SQL_PASSWORD',
      // 'JWT_SECRET',
      // Example: Load file-based secrets (keys, certificates, etc.)
      // {
      //   name: 'PRIVATE_KEY',
      //   type: 'file',
      //   targetEnvVar: 'PRIVATE_KEY_PATH',
      //   filename: 'private-key.pem'
      // },
      // {
      //   name: 'JWKS',
      //   type: 'file',
      //   targetEnvVar: 'JWKS_PATH',
      //   filename: 'jwks.json'
      // }
    ]
  };

  return new Server({
    globalMiddleware: [app, cookieParser.default(), authMiddleware],
    endpoints: Object.values(endpoints),
    secretManager: secretManagerConfig
  });
}
