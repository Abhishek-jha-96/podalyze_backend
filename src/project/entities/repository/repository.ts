import { Injectable } from '@nestjs/common';
import { ProjectRepository } from '../project.repository';
import { Project } from 'src/project/domain/project';
import { NullableType, IPaginationOptions } from 'src/utils/types/types-helper';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectSchemaClass } from '../project.entity';
import { Model } from 'mongoose';
import { ProjectMapper } from '../mapper/project.mapper';
import { SortProjectDto } from 'src/project/dto/query-project.dto';

@Injectable()
export class ProjectDocumentRepository implements ProjectRepository {
  constructor(
    @InjectModel(ProjectSchemaClass.name)
    private readonly projectModel: Model<ProjectSchemaClass>,
  ) {}

  async create(data: Project): Promise<Project> {
    const persistenceModel = ProjectMapper.toPersistance(data);
    const createdProject = await this.projectModel.create(persistenceModel);
    const projectObject = await createdProject.save();
    return ProjectMapper.toDomain(projectObject);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortProjectDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Project[]> {
    const projectObject = await this.projectModel
      .find()
      .sort(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy === 'id' ? '_id' : sort.orderBy]:
              sort.order.toUpperCase() === 'ASC' ? 1 : -1,
          }),
          {},
        ),
      )
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return projectObject.map((projectObject) =>
      ProjectMapper.toDomain(projectObject),
    );
  }

  async findById(id: Project['id']): Promise<NullableType<Project>> {
    const projectObject = await this.projectModel.findById(id);
    return projectObject ? ProjectMapper.toDomain(projectObject) : null;
  }

  async findByIds(ids: Project['id'][]): Promise<Project[]> {
    const projectObject = await this.projectModel.find({ _id: { $in: ids } });
    return projectObject.map((projectObject) =>
      ProjectMapper.toDomain(projectObject),
    );
  }

  async findByCreatedBy({
    createdBy,
  }: {
    createdBy: Project['createdBy'];
  }): Promise<NullableType<Project>> {
    const projectObject = await this.projectModel.findOne({ createdBy });
    return projectObject ? ProjectMapper.toDomain(projectObject) : null;
  }

  async update(
    id: Project['id'],
    payload: Partial<Project>,
  ): Promise<Project | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const project = await this.projectModel.findOne(filter);

    if (!project) {
      return null;
    }

    const updatedData = {
      ...ProjectMapper.toDomain(project),
      ...clonedPayload,
    };

    const projectObject = await this.projectModel.findOneAndUpdate(
      filter,
      ProjectMapper.toPersistance(updatedData),
      { new: true },
    );

    return projectObject ? ProjectMapper.toDomain(projectObject) : null;
  }

  async remove(id: Project['id']): Promise<void> {
    await this.projectModel.findByIdAndDelete(id);
  }
}
