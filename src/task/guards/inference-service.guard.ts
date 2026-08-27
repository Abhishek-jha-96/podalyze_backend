import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class InferenceServiceGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.header('x-inference-service-key');
    const expected = this.configService.get<string>('INFERENCE_SERVICE_SECRET');

    if (!expected || !provided || provided !== expected) {
      throw new UnauthorizedException('Invalid inference service credentials');
    }

    return true;
  }
}
