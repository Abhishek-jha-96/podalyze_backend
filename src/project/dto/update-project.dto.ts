import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @ApiProperty()
  @ApiProperty({ example: 'The automation', type: String })
  @IsNotEmpty()
  title: string;
}
