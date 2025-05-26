import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfigService } from './swagger/swagger-config';
import { SwaggerModule as NestSwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfigService = app.get(SwaggerConfigService);
  const config = swaggerConfigService.getDocumentBuilder();
  const customOptions = swaggerConfigService.getCustomOptions();

  const document = NestSwaggerModule.createDocument(app, config);
  NestSwaggerModule.setup('api/docs', app, document, customOptions);

  await app.listen(3000);
}
bootstrap();
