import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';
import { AllConfigType } from 'src/configs/config.types';
import { ProjectPersistanceModule } from 'src/project/entities/entity-persistance.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const redis = configService.get('redis', { infer: true });
        const url = redis?.url ?? 'redis://localhost:6379';
        const ttl = redis?.ttlMs ?? 300000;
        const store = createKeyv(url, {
          namespace: 'podalyze-dashboard',
          throwOnConnectError: false,
        });

        store.on('error', (error) => {
          Logger.error(error, 'RedisCache');
        });

        return {
          stores: [store],
          ttl,
        };
      },
    }),
    ProjectPersistanceModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
