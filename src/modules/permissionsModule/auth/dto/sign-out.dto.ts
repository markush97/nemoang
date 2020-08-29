import { IsString, IsOptional } from 'class-validator';

export class SignOutDto {
  @IsString()
  @IsOptional()
  readonly refresh_token: string;
}
