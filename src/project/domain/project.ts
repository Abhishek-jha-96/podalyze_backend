import { ApiProperty } from '@nestjs/swagger';

export class Project {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'The Cook.',
  })
  title: string | null;

  @ApiProperty({
    type: String,
    format: 'uri',
    example: 'https://example.com',
    description: 'Public URL of the project',
  })
  url: string;

  @ApiProperty({
    type: Number,
    example: 55,
  })
  hostPopularity: number;

  @ApiProperty({
    type: Number,
    example: 85,
  })
  guestPopularity: number;

  @ApiProperty({
    type: Number,
    example: 5,
  })
  numberOfAds: number;

  @ApiProperty()
  createdBy: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
