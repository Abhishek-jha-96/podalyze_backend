import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfigService } from './swagger/swagger-config';
import { SwaggerModule as NestSwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import validationOptions from './utils/validation-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.ALLOWED_ORIGINS],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  const swaggerConfigService = app.get(SwaggerConfigService);
  const config = swaggerConfigService.getDocumentBuilder();
  const customOptions = swaggerConfigService.getCustomOptions();

  const document = NestSwaggerModule.createDocument(app, config);
  NestSwaggerModule.setup('api/docs', app, document, customOptions);

  await app.listen(3000);
}
bootstrap();
