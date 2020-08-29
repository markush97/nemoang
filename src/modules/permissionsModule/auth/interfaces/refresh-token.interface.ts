import { TokenTypeEnum } from '../enums/token-type.enum';
import { User } from '@app/permissions/user/interfaces/user.interface';

export interface RefreshToken {
  created?: number;
  info?: {
    userAgent: string;
    ip: string;
    location: string;
  };
  token: string;
}
