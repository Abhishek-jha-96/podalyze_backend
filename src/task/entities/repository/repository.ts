import { TaskRepository } from '../task.repository';
import { Model } from 'mongoose';
import { TaskSchemaClass } from '../task.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Task } from 'src/task/domain/task';
import { IPaginationOptions, NullableType } from 'src/utils/types/types-helper';
import { TaskMapper } from '../mapper/task.mapper';
import { SortTaskDto } from 'src/task/dto/query-task.dto';

@Injectable()
export class TaskDocumentRepository implements TaskRepository {
  constructor(
    @InjectModel(TaskSchemaClass.name)
    private readonly taskModel: Model<TaskSchemaClass>,
  ) {}
  async create(data: Task): Promise<Task> {
    const persistenceModel = TaskMapper.toPersistance(data);
    const createdtask = await this.taskModel.create(persistenceModel);
    const taskObject = await createdtask.save();
    return TaskMapper.toDomain(taskObject);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortTaskDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Task[]> {
    const taskObject = await this.taskModel
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

    return taskObject.map((taskObject) => TaskMapper.toDomain(taskObject));
  }

  async findById(id: Task['id']): Promise<NullableType<Task>> {
    const taskObject = await this.taskModel.findById(id);
    return taskObject ? TaskMapper.toDomain(taskObject) : null;
  }

  async findByIds(ids: Task['id'][]): Promise<Task[]> {
    const taskObject = await this.taskModel.find({ _id: { $in: ids } });
    return taskObject.map((taskObject) => TaskMapper.toDomain(taskObject));
  }

  async findByCreatedBy({
    createdBy,
  }: {
    createdBy: Task['createdBy'];
  }): Promise<NullableType<Task>> {
    const taskObject = await this.taskModel.findOne({ createdBy });
    return taskObject ? TaskMapper.toDomain(taskObject) : null;
  }

  async update(id: Task['id'], payload: Partial<Task>): Promise<Task | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const task = await this.taskModel.findOne(filter);

    if (!task) {
      return null;
    }

    const updatedData = {
      ...TaskMapper.toDomain(task),
      ...clonedPayload,
    };

    const taskObject = await this.taskModel.findOneAndUpdate(
      filter,
      TaskMapper.toPersistance(updatedData),
      { new: true },
    );

    return taskObject ? TaskMapper.toDomain(taskObject) : null;
  }

  async remove(id: Task['id']): Promise<void> {
    await this.taskModel.findByIdAndDelete(id);
  }
}
