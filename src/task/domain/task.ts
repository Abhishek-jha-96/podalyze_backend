import { ApiProperty } from '@nestjs/swagger';

export class Task {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  project: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdBy: string;
}
