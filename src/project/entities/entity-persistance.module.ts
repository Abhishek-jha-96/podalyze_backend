import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema, ProjectSchemaClass } from './project.entity';
import { ProjectRepository } from './project.repository';
import { ProjectDocumentRepository } from './repository/repository';
import {
  TaskSchema,
  TaskSchemaClass,
} from 'src/task/entities/task.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectSchemaClass.name, schema: ProjectSchema },
      // Required so project virtual `tasks` can populate across modules
      { name: TaskSchemaClass.name, schema: TaskSchema },
    ]),
  ],
  providers: [
    {
      provide: ProjectRepository,
      useClass: ProjectDocumentRepository,
    },
  ],
  exports: [ProjectRepository],
})
export class ProjectPersistanceModule {}
