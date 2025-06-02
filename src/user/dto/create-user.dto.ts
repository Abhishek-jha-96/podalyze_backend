import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/lowercase-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password@123', type: String })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John', type: String })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Doe', type: String })
  @IsNotEmpty()
  last_name: string;

  provider?: string;
}
