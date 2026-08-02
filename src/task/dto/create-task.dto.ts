import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { SentimentEnum, StatusEnum } from '../domain/task';

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

  @ApiProperty({
    enum: SentimentEnum,
    enumName: 'SentimentEnum',
    description: 'The sentiment of the task',
    example: SentimentEnum.POSITIVE,
  })
  @IsEnum(SentimentEnum, {
    message: `sentiment must be a valid enum value: ${Object.values(SentimentEnum).join(', ')}`,
  })
  @IsOptional()
  sentiment?: SentimentEnum;

  @ApiProperty()
  @IsOptional()
  watchTime?: number;

  @ApiProperty()
  @IsOptional()
  metaData?: Record<string, any>;
}
