import { Project } from 'src/project/domain/project';
import { ProjectSchemaClass } from '../project.entity';
import { Types } from 'mongoose';

export class ProjectMapper {
  static toDomain(raw: ProjectSchemaClass): Project {
    const domainEntity = new Project();
    domainEntity.id = raw._id.toString();
    domainEntity.title = raw.title;
    domainEntity.url = raw.url;
    domainEntity.createdBy = raw.createdBy?.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistance(domainEntity: Project): ProjectSchemaClass {
    const persistenceSchema = new ProjectSchemaClass();
    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.title = domainEntity.title;
    persistenceSchema.url = domainEntity.url;
    if (domainEntity.createdBy) {
      persistenceSchema.createdBy = new Types.ObjectId(domainEntity.createdBy);
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    return persistenceSchema;
  }
}
