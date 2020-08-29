import { IsOptional, IsString, IsInt, IsEmail, IsNotIn } from 'class-validator';
import { ConfigService } from '@app/core/config/config.service';

export class UpdateUserSelfDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  // @IsNotIn(this.config.getForrbiddenUsernames())
  readonly username: string;

  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsOptional()
  @IsString()
  readonly street?: string;

  @IsOptional()
  @IsInt()
  readonly number?: number;

  @IsOptional()
  @IsInt()
  readonly stair?: number;

  @IsOptional()
  @IsInt()
  readonly door?: number;

  @IsOptional()
  @IsInt()
  readonly zip?: number;

  @IsOptional()
  @IsString()
  readonly city?: string;

  @IsOptional()
  @IsString()
  readonly country?: string;
}
