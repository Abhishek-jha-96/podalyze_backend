import { Task } from 'src/task/domain/task';
import { TaskSchemaClass } from '../task.entity';
import { Types } from 'mongoose';

export class TaskMapper {
  static toDomain(raw: TaskSchemaClass): Task {
    const domainEntity = new Task();
    domainEntity.id = raw._id.toString();
    domainEntity.project = raw.project?.toString();
    domainEntity.createdBy = raw.createdBy?.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistance(domainEntity: Task): TaskSchemaClass {
    const persistenceSchema = new TaskSchemaClass();
    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceSchema._id = domainEntity.id;
    }
    if (domainEntity.project) {
      persistenceSchema.project = new Types.ObjectId(domainEntity.project);
    }
    if (domainEntity.createdBy) {
      persistenceSchema.createdBy = new Types.ObjectId(domainEntity.createdBy);
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    return persistenceSchema;
  }
}
