import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
  Injectable,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdPipe implements PipeTransform<string> {
  /**
   * Checks if the given value is a valid Mongo-Object-Id
   * @param value - Object to check
   */
  async transform(value, { metatype }: ArgumentMetadata) {
    if (!Types.ObjectId.isValid(value)) throw new BadRequestException();
    return value;
  }
}
