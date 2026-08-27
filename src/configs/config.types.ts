import { AuthConfig } from 'src/auth/config/auth-config.types';
import { DatabaseConfig } from './database-config.types';
import { RedisConfig } from './redis-config.types';

export type AllConfigType = {
  auth: AuthConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
};
