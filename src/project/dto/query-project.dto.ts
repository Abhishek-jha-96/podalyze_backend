import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { Project } from '../domain/project';

export class SortProjectDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  orderBy: keyof Project;

  @ApiProperty()
  @IsString()
  order: string;
}
