import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskPersistanceModule } from './entities/entity-persistence.module';

@Module({
  imports: [TaskPersistanceModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskPersistanceModule, TaskService],
})
export class TaskModule {}
