import { Injectable, Module } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ConfigService {
  get(key: string): string {
    return process.env[key];
  }

  getNumber(key: string): number {
    return parseInt(process.env[key], 10);
  }

  getBoolean(key: string): boolean {
    return process.env[key] === 'true';
  }

  // Specific getters for common config values
  get mongoUri(): string {
    return this.get('MONGO_URI');
  }

  get jwtAccessSecret(): string {
    return this.get('JWT_ACCESS_SECRET');
  }

  get jwtRefreshSecret(): string {
    return this.get('JWT_REFRESH_SECRET');
  }

  get uploadDir(): string {
    return this.get('UPLOAD_DIR') || './uploads';
  }

  get maxFileSize(): number {
    return this.getNumber('MAX_FILE_SIZE') || 5242880; // 5MB
  }

  get port(): number {
    return this.getNumber('PORT') || 3000;
  }
}

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
