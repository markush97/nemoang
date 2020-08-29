import { createParamDecorator } from '@nestjs/common';

export const UserAgent = createParamDecorator((_, req) => req.headers['user-agent']);
