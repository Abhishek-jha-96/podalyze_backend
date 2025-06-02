import { AuthConfig } from 'src/auth/config/auth-config.types';
import { DatabaseConfig } from './database-config.types';

export type AllConfigType = {
  auth: AuthConfig;
  database: DatabaseConfig;
};
