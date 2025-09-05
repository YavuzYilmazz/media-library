import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigService } from '../config/config';

@Injectable()
export class DatabaseLoader implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.mongoUri,
    };
  }
}
