import { TokenTypeEnum } from '../enums/token-type.enum';
import { Types as MongooseTypes } from 'mongoose';

export interface AccessToken {
  userId: MongooseTypes.ObjectId;
  roles: string[];
  type: TokenTypeEnum;
}
