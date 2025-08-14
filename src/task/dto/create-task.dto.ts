import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { StatusEnum } from '../domain/task';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  project: string;

  @ApiProperty({
    required: false,
  })
  status?: StatusEnum;
}
