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
