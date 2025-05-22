import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './database-config.types';

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    url: process.env.DATABASE_URL,

    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '27017', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME || 'nest-mongo',

    maxConnections: parseInt(process.env.DATABASE_MAX_CONN || '100', 10),
    sslEnabled: process.env.DATABASE_SSL === 'true',
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
    ca: process.env.DATABASE_CA,
    cert: process.env.DATABASE_CERT,
    key: process.env.DATABASE_KEY,
  }),
);
