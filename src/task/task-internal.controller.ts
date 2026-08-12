import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InferenceServiceGuard } from './guards/inference-service.guard';

@ApiTags('Tasks Internal')
@ApiHeader({
  name: 'X-Inference-Service-Key',
  required: true,
})
@UseGuards(InferenceServiceGuard)
@Controller({
  path: 'task',
  version: '1',
})
export class TaskInternalController {
  constructor(private readonly taskService: TaskService) {}

  @Patch(':id/inference-result')
  updateFromInference(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, updateTaskDto);
  }
}
