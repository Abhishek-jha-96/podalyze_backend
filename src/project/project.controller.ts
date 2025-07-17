import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Projects')
@Controller({
  path: 'project',
  version: '1',
})
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const user = req.user;
    return this.projectService.create(createProjectDto, user);
  }

  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '25') {
    return this.projectService.findAll({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
