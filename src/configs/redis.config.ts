import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';
import { RedisConfig, RedisDefaultConfig } from './redis-config.types';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  REDIS_CACHE_URL: string;

  @IsString()
  @IsOptional()
  REDIS_CACHE_TTL_MS: string;
}

export default registerAs<RedisConfig>('redis', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    url: process.env.REDIS_CACHE_URL || RedisDefaultConfig.Url,
    ttlMs: parseInt(
      process.env.REDIS_CACHE_TTL_MS || RedisDefaultConfig.TtlMs,
      10,
    ),
  };
});
