import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectRepository } from './entities/project.repository';
import { User } from 'src/user/domain/user';
import { IPaginationOptions } from 'src/utils/types/types-helper';
import { TaskService } from 'src/task/task.service';
import { StatusEnum } from 'src/task/domain/task';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly taskService: TaskService,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    const inferenceEndpoint = process.env.INFERENCE_BASE_URL;

    if (!inferenceEndpoint) {
      throw new Error('INFERENCE_BASE_URL is not defined');
    }

    const project = await this.projectRepository.create({
      title: createProjectDto.title,
      url: createProjectDto.url,
      createdBy: user.id,
      hostPopularity: createProjectDto.hostPopularity,
      guestPopularity: createProjectDto.guestPopularity,
      numberOfAds: createProjectDto.numberOfAds,
    });

    const taskData = {
      project: project.id,
      status: StatusEnum.ACTIVE,
    };

    const task = await this.taskService.create(taskData, user);

    if (!task) {
      throw new Error('Failed to create automatic analysis task.');
    }

    try {
      const response = await fetch(`${inferenceEndpoint}/api/v1/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: createProjectDto.title,
          url: createProjectDto.url,
          host_popularity: createProjectDto.hostPopularity,
          guest_popularity: createProjectDto.guestPopularity,
          number_of_ads: createProjectDto.numberOfAds,
          task_id: task.id,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Inference service error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Inference service failed:', error);
      throw new Error('Failed to analyze podcast video');
    }

    const projectWithTasks = await this.projectRepository.findById(project.id);
    return projectWithTasks ?? project;
  }

  findAll(paginationParams: IPaginationOptions) {
    return this.projectRepository.findManyWithPagination({
      sortOptions: null,
      paginationOptions: paginationParams,
    });
  }

  remove(id: string) {
    return this.projectRepository.remove(id);
  }
}
