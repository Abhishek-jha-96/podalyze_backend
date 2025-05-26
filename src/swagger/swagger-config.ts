import { Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

@Injectable()
export class SwaggerConfigService {
  getDocumentBuilder() {
    return new DocumentBuilder()
      .setTitle('Podalyze Backend')
      .setDescription('API Service for Podalyze backend.')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
  }

  getCustomOptions(): SwaggerCustomOptions {
    return {
      swaggerOptions: {
        persistAuthorization: true,
      },
    };
  }
}
