import { Injectable } from '@nestjs/common';
import { AuthRegisterLoginDto } from './dto/create-.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AllConfigType } from 'src/configs/config.types';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    await this.usersService.create({
      ...dto,
      email: dto.email,
    });
  }

  async login(dto: LoginUserDto): Promise<string> {
    const email = dto.email;

    const user = await this.usersService.findByEmail(email);

    console.log(user);
    return '';
  }
}
