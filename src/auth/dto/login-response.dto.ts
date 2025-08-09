import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/domain/user';

export class LoginResponseDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  tokenExpires: number;
}
