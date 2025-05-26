import { Module } from '@nestjs/common';
import { SwaggerConfigService } from './swagger-config';

@Module({
  providers: [SwaggerConfigService],
  exports: [SwaggerConfigService],
})
export class SwaggerModule {}
