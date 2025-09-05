import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import * as helmet from 'helmet';
import * as compression from 'compression';
import * as cors from 'cors';
import * as rateLimit from 'express-rate-limit';

import {
  ConfigService,
  ConfigModule as CustomConfigModule,
} from './config/config';
import { GlobalErrorFilter } from './middlewares/error.middleware';

import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { MediaController } from './controllers/media.controller';
import { HealthController } from './controllers/health.controller';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { MediaService } from './services/media.service';

import { User, UserSchema } from './models/user.model';
import { Media, MediaSchema } from './models/media.model';

import { JwtAuthGuard } from './middlewares/auth.middleware';
import { JwtStrategy } from './middlewares/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomConfigModule,
    MongooseModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.mongoUri,
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Media.name, schema: MediaSchema },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [CustomConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    MediaController,
    HealthController,
  ],
  providers: [
    ConfigService,
    AuthService,
    UserService,
    MediaService,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: APP_FILTER,
      useClass: GlobalErrorFilter,
    },
  ],
})
export class AppModule {
  static setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('Media Library API')
      .setDescription(
        'NestJS + MongoDB Media Library API with JWT Authentication',
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  static setupMiddleware(app: INestApplication): void {
    app.use(helmet.default());
    app.use(compression.default());
    app.use(cors.default());

    app.use(
      rateLimit.default({
        windowMs: 15 * 60 * 1000,
        max: 100,
      }),
    );

    app.useGlobalFilters(new GlobalErrorFilter());
  }
}
