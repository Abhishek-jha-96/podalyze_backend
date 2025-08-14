import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
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
}
