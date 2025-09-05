import * as Joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
  }),
  name: Joi.string().min(2).max(50).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
    email: string;

  @ApiProperty({ example: 'Passw0rd!', minLength: 6 })
    password: string;

  @ApiProperty({ example: 'John Doe' })
    name: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
    email: string;

  @ApiProperty({ example: 'Passw0rd!' })
    password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
    refreshToken: string;
}
