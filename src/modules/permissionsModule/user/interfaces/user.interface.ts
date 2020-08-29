import { Document, Types as MongooseTypes } from 'mongoose';
import { RefreshToken } from '@app/permissions/auth/interfaces/refresh-token.interface';

export interface User extends Document {
  readonly email: string;
  readonly username: string;
  password: string;

  readonly roles: MongooseTypes.ObjectId[];

  readonly updated?: number;
  readonly created?: number;

  readonly firstName?: string;
  readonly lastName?: string;

  readonly street?: string;
  readonly number?: number;
  readonly stair?: number;
  readonly door?: number;
  readonly city?: string;
  readonly country?: string;
  readonly zip?: number;

  readonly active?: boolean;

  readonly _id?: string;

  readonly refreshToken?: RefreshToken[];
}
