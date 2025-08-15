import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { StatusEnum } from '../domain/task';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  project: string;

  @ApiProperty({
    enum: StatusEnum,
    enumName: 'StatusEnum',
    description: 'The status of the task',
    example: StatusEnum.ACTIVE,
  })
  @IsEnum(StatusEnum, {
    message: `status must be a valid enum value: ${Object.values(StatusEnum).join(', ')}`,
  })
  @IsOptional()
  status?: StatusEnum;
}
