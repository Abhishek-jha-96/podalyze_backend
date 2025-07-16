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

  @ApiProperty()
  @IsNotEmpty()
  createdBy: string;
}
