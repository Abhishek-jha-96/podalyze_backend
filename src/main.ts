import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfigService } from './swagger/swagger-config';
import { SwaggerModule as NestSwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import validationOptions from './utils/validation-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(process.env.ALLOWED_ORIGINS);
  app.enableCors({
  origin: (origin, callback) => {
    const allowed = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (!origin || allowed.includes(origin.trim())) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  // 🚨 CRITICAL FIX: Explicitly allow the headers your frontend is sending
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 204, // Forces a 2xx response for preflight
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
