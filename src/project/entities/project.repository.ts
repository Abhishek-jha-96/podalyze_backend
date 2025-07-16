import {
  DeepPartial,
  IPaginationOptions,
  NullableType,
} from 'src/utils/types/types-helper';
import { Project } from '../domain/project';
import { SortProjectDto } from '../dto/query-project.dto';

export abstract class ProjectRepository {
  abstract create(
    data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Project>;

  abstract findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortProjectDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Project[]>;
  abstract findById(id: Project['id']): Promise<NullableType<Project>>;
  abstract findByIds(ids: Project['id'][]): Promise<Project[]>;
  abstract findByCreatedBy({
    createdBy,
  }: {
    createdBy: Project['createdBy'];
  }): Promise<NullableType<Project>>;

  abstract update(
    id: Project['id'],
    payload: DeepPartial<Project>,
  ): Promise<Project | null>;

  abstract remove(id: Project['id']): Promise<void>;
}
