import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskRepository } from './entities/task.repository';
import { User } from 'src/user/domain/user';
import { IPaginationOptions } from 'src/utils/types/types-helper';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    const task = await this.taskRepository.create({
      project: createTaskDto.project,
      status: createTaskDto.status,
      createdBy: user.id,
    });

    return task;
  }

  findAll(paginationParams: IPaginationOptions) {
    return this.taskRepository.findManyWithPagination({
      sortOptions: null,
      paginationOptions: paginationParams,
    });
  }

  findOne(id: string) {
    return this.taskRepository.findById(id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.update(id, updateTaskDto);
    return task;
  }

  remove(id: string) {
    return this.taskRepository.remove(id);
  }
}
