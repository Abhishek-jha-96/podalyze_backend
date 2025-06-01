export type DatabaseConfig = {
  url?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  name?: string;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
  ca?: string;
  cert?: string;
  key?: string;
  maxConnections: number;
};

export enum DatabaseDefaultConfig {
  Host = 'localhost',
  Port = '27017',
  name = 'database',
  maxConnections = '100',
}
