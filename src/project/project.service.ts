import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectRepository } from './entities/project.repository';
import { User } from 'src/user/domain/user';
import { Project } from './domain/project';
import { NullableType } from 'src/utils/types/types-helper';
import { getPodcastData } from './utils/youtube.helper';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  create(createProjectDto: CreateProjectDto, user: User) {
    const projectData = getPodcastData(createProjectDto.url);

    // create a task.
    console.log(projectData);

    return this.projectRepository.create({
      title: createProjectDto.title,
      url: createProjectDto.url,
      createdBy: user.id,
    });
  }

  findAll() {
    return `This action returns all project`;
  }

  findById(id: Project['id']): Promise<NullableType<Project>> {
    return this.projectRepository.findById(id);
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return updateProjectDto;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
