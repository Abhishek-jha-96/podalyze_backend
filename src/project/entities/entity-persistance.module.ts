import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectSchema, ProjectSchemaClass } from './project.entity';
import { ProjectRepository } from './project.repository';
import { ProjectDocumentRepository } from './repository/repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectSchemaClass.name, schema: ProjectSchema },
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
