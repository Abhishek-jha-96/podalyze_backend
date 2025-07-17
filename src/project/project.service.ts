import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectRepository } from './entities/project.repository';
import { User } from 'src/user/domain/user';
import { IPaginationOptions } from 'src/utils/types/types-helper';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    const inferenceEndpoint = process.env.INFERENCE_BASE_URL;

    if (!inferenceEndpoint) {
      throw new Error('INFERENCE_BASE_URL is not defined');
    }

    try {
      const response = await fetch(`${inferenceEndpoint}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: createProjectDto.url,
        }),
      });

      if (!response.ok) {
        throw new Error(`Inference service error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Inference service failed:', error);
      throw new Error('Failed to analyze podcast video');
    }

    const project = await this.projectRepository.create({
      title: createProjectDto.title,
      url: createProjectDto.url,
      createdBy: user.id,
    });

    return project;
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
