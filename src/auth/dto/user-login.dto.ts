import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/lowercase-transformer';

export class LoginUserDto {
  @ApiProperty({ example: 'john@doe.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret@123', type: String })
  @IsNotEmpty()
  password: string;
}
