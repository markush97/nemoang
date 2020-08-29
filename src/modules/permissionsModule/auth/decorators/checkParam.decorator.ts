import { ReflectMetadata } from '@nestjs/common';

export const CheckParams = (paramsToCheck: number
) =>
  ReflectMetadata(
    'checkParams',
    paramsToCheck
  );
