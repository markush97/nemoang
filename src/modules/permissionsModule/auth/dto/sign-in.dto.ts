import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class SignInDto {
  @IsString()
  readonly emailOrUsername: string;

  @IsString()
  readonly password: string;

  @IsOptional()
  @IsBoolean()
  readonly perma: boolean;
}
