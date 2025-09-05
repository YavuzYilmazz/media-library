import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const mediaPermissionSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(), // MongoDB ObjectId validation
  action: Joi.string().valid('add', 'remove').required(),
});

export const mediaQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

export class UploadMediaDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export class MediaPermissionDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  userId: string;

  @ApiProperty({ example: 'add', enum: ['add', 'remove'] })
  action: 'add' | 'remove';
}

export class MediaQueryDto {
  @ApiProperty({ required: false })
  page?: number;

  @ApiProperty({ required: false })
  limit?: number;
}
