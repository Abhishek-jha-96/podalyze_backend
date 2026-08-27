import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskInternalController } from './task-internal.controller';
import { TaskPersistanceModule } from './entities/entity-persistence.module';
import { InferenceServiceGuard } from './guards/inference-service.guard';

@Module({
  imports: [TaskPersistanceModule],
  controllers: [TaskController, TaskInternalController],
  providers: [TaskService, InferenceServiceGuard],
  exports: [TaskPersistanceModule, TaskService],
})
export class TaskModule {}
