import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectPersistanceModule } from './entities/entity-persistance.module';

@Module({
  imports: [ProjectPersistanceModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectPersistanceModule],
})
export class ProjectModule {}
