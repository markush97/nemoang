import { createParamDecorator } from '@nestjs/common';

export const IP = createParamDecorator((_, req) => req.ip);
