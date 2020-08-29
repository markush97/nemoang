import { HttpStatus, HttpException, BadRequestException } from '@nestjs/common';

export class MongoException extends BadRequestException {
    constructor(error) {
      super(error);
    }
  }