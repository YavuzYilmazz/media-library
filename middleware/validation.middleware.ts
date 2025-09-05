import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

export function validationMiddleware(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      throw new BadRequestException(errorMessages);
    }
    
    req.body = value;
    next();
  };
}

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  constructor(private readonly validationSchema: Joi.ObjectSchema) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { error, value } = this.validationSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      throw new BadRequestException(errorMessages);
    }
    
    req.body = value;
    next();
  }
}
