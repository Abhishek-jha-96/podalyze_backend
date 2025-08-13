import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema, TaskSchemaClass } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskDocumentRepository } from './repository/repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TaskSchemaClass.name, schema: TaskSchema },
    ]),
  ],
  providers: [
    {
      provide: TaskRepository,
      useClass: TaskDocumentRepository,
    },
  ],
  exports: [TaskRepository],
})
export class TaskPersistanceModule {}
