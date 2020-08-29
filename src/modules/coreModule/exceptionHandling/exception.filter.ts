import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const message = exception.message;

    // MongoException
    if (message.message && message.message.code === 11000) {
      let key = message.message.errmsg.split('index: ')[1].split(' dup key')[0];
      key = key.substring(0, key.lastIndexOf('_'));
      const value = message.message.errmsg.split('"')[1];

      response.status(status).json({
        statusCode: status,
        path: request.url,
        error: 'Duplicate Value',
        messages: [key + ': "' + value + '" already exists!'],
        original_message: message,
      });

    // ValidationError
    } else if (
      status === 400 &&
      message.message[0] instanceof ValidationError
    ) {
      const validation_messages: string[] = [];

      message.message.forEach(val_msg => {
        validation_messages.push('"' + val_msg.value + '": field ' + val_msg.constraints[Object.keys(val_msg.constraints)[0]]);
      });

      response.status(status).json({
        statusCode: status,
        path: request.url,
        error: 'Incorrect Inputs',
        messages: validation_messages,
        original_message: message,
      });

    // Other Error
    } else {

      response.status(status).json({
        statusCode: status,
        path: request.url,
        error: message.error,
        messages: [message.message],
        original_message: message,
      });
    }
  }
}
