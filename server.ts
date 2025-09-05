import { NestFactory } from '@nestjs/core';
import { AppModule } from './app';
import { ConfigService } from './config/config';
import { Logger } from './utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Setup middleware and swagger
  AppModule.setupMiddleware(app);
  AppModule.setupSwagger(app);

  const port = configService.get('PORT') || 3000;

  await app.listen(port);
  logger.info(`🚀 Server running on http://localhost:${port}`);
  logger.info(`📚 Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
