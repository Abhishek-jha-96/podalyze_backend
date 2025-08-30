import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'The automation', type: String })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://www.youtube.com/', type: String })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({ example: 55, type: Number })
  @IsNotEmpty()
  hostPopularity: number;

  @ApiProperty({ example: 89, type: Number })
  @IsNotEmpty()
  guestPopularity: number;

  @ApiProperty({ example: 3, type: Number })
  @IsNotEmpty()
  numberOfAds: number;
}
