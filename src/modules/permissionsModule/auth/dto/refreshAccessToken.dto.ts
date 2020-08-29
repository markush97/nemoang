import { IsString, IsBoolean } from 'class-validator';
import { ObjectIdPipe } from '@app/core/pipes/object-id.pipe';

export class RefreshAccessTokenDto {
  @IsString()
  readonly refreshToken: string;

}
