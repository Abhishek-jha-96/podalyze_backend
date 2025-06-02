import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/lowercase-transformer';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'john@doe.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret@123', type: String })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John', type: String })
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Doe', type: String })
  @IsNotEmpty()
  last_name: string;
}
