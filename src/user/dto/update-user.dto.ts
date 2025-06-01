import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John', type: String })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Doe', type: String })
  @IsNotEmpty()
  last_name: string;
}
