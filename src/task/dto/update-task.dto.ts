import { PartialType, PickType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PickType(PartialType(CreateTaskDto), [
  'status',
] as const) {}
