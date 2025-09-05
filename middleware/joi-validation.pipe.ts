import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: Joi.ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error, value: validatedValue } = this.schema.validate(value, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      throw new BadRequestException(errorMessages);
    }
    
    return validatedValue;
  }
}
