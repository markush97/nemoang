import { User } from '@app/user/interfaces/user.interface';
import { Policy } from '@app/permissions/policies/interfaces/policy.interface';
import { RefreshToken } from '@app/permissions/auth/interfaces/refresh-token.interface';

export interface SignInReturnValue {
  readonly access_token: string;
  readonly expires_in: number;
  readonly refresh_token?: string;
  readonly user: User;
  readonly permissions: string[];
}
