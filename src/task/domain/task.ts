import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export enum SentimentEnum {
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative',
  NEUTRAL = 'Neutral',
}

export class Task {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  project: string;

  @ApiProperty({
    enum: StatusEnum,
    enumName: 'StatusEnum',
    description: 'The status of the item',
    example: StatusEnum.ACTIVE,
  })
  @IsEnum(StatusEnum, {
    message: 'Status must be one of active, inactive, pending',
  })
  status: StatusEnum = StatusEnum.ACTIVE;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdBy: string;

  @ApiProperty({
    enum: SentimentEnum,
    enumName: 'SentimentEnum',
    description: 'The sentiment of the task',
    example: SentimentEnum.POSITIVE,
  })
  @IsEnum(SentimentEnum, {
    message: 'Sentiment must be one of Positive, Negative, Neutral',
  })
  sentiment?: SentimentEnum;

  @ApiProperty()
  watchTime?: number;

  @ApiProperty()
  metaData?: Record<string, any>;
}
