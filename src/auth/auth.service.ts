import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import { AuthRegisterLoginDto } from './dto/create-.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AllConfigType } from 'src/configs/config.types';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from './dto/user-login.dto';
import { AuthProvidersEnum } from './config/auth-config.types';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from 'src/user/domain/user';
import * as ms from 'ms';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
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

  async login(dto: LoginUserDto): Promise<LoginResponseDto> {
    const email = dto.email;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          email: `needLoginViaProvider:${user.provider}`,
        },
      });
    }

    if (!user.password) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: {
          password: 'incorrectPassword',
        },
      });
    }

    const hash = crypto
      .createHmac('sha256', process.env.SECRET_KEY)
      .update(user.id + Date.now())
      .digest('hex');

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      hash,
    });

    return {
      user,
      refreshToken,
      token,
      tokenExpires,
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<Omit<LoginResponseDto, 'user'>> {
    const authConfig = this.configService.getOrThrow('auth', { infer: true });

    // Normalize refresh token input
    const tokenStr =
      typeof refreshTokenDto === 'string'
        ? refreshTokenDto
        : (refreshTokenDto as any)?.refreshToken;

    const payload: { id: string; hash: string } =
      await this.jwtService.verifyAsync(tokenStr, {
        secret: authConfig.refreshSecret,
      });

    const user = await this.usersService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      hash: payload.hash,
    });

    return { token, refreshToken, tokenExpires };
  }

  private async getTokensData(data: { id: User['id']; hash: string }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth', {
      infer: true,
    }).expires;

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
        },
        {
          secret: this.configService.getOrThrow('auth', { infer: true }).secret,
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          hash: data.hash,
          id: data.id,
        },
        {
          secret: this.configService.getOrThrow('auth', {
            infer: true,
          }).refreshSecret,
          expiresIn: this.configService.getOrThrow('auth', {
            infer: true,
          }).refreshExpires,
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
