import { Task } from '../domain/task';
import {
  DeepPartial,
  IPaginationOptions,
  NullableType,
} from 'src/utils/types/types-helper';
import { SortTaskDto } from '../dto/query-task.dto';

export abstract class TaskRepository {
  abstract create(
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Task>;

  abstract findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortTaskDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Task[]>;

  abstract findById(id: Task['id']): Promise<NullableType<Task>>;
  abstract findByIds(ids: Task['id'][]): Promise<Task[]>;
  abstract findByCreatedBy({
    createdBy,
  }: {
    createdBy: Task['createdBy'];
  }): Promise<NullableType<Task>>;

  abstract update(
    id: Task['id'],
    payload: DeepPartial<Task>,
  ): Promise<Task | null>;

  abstract remove(id: Task['id']): Promise<void>;
}
