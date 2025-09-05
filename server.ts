import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { ConfigService } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Setup middleware and swagger
  AppModule.setupMiddleware(app);
  AppModule.setupSwagger(app);

  const port = configService.get('PORT') || 3000;

  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
