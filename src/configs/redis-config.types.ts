export type RedisConfig = {
  url: string;
  ttlMs: number;
};

export enum RedisDefaultConfig {
  Url = 'redis://localhost:6379',
  TtlMs = '300000',
}
