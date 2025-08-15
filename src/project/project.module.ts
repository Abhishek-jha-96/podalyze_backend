import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectPersistanceModule } from './entities/entity-persistance.module';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [ProjectPersistanceModule, TaskModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectPersistanceModule],
})
export class ProjectModule {}
