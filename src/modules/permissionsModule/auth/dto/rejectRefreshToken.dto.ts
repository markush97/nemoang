import { IsString, IsBoolean } from 'class-validator';

export class RejectRefreshTokenDto {
  @IsString()
  readonly refreshToken_id: string;

}
