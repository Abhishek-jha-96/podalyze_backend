import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { Task } from '../domain/task';

export class SortTaskDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Task;

  @ApiProperty()
  @IsString()
  order: string;
}
