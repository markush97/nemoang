import {
  ArrayUnique,
  IsEmail,
  IsEnum,
  IsString,
  IsOptional,
  IsBoolean,
  IsIn,
  IsInt,
  IsAlpha,
  IsNumberString,
  Matches,
} from 'class-validator';
import { getAlpha3Codes } from 'i18n-iso-countries';

export class UpdateUserDto {
  @IsEmail()
  readonly email: string;

  @Matches(RegExp('[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*'))
  // @IsNotIn(this.config.getForrbiddenUsernames())
  readonly username: string;

  @IsOptional()
  @IsAlpha()
  readonly firstName: string;

  @IsOptional()
  @IsAlpha()
  readonly lastName: string;

  @IsOptional()
  @IsAlpha()
  readonly street: string;

  @IsOptional()
  @IsInt()
  readonly number: number;

  @IsOptional()
  @IsInt()
  readonly stair: number;

  @IsOptional()
  @IsInt()
  readonly door: number;

  @IsOptional()
  @IsInt()
  readonly zip: number;

  @IsOptional()
  @IsIn(Object.keys(getAlpha3Codes()).map(key => getAlpha3Codes()[key]))
  readonly country: string;

  @IsOptional()
  @IsAlpha()
  readonly city: string;

  @IsOptional()
  @IsBoolean()
  readonly active?: boolean;

  @IsOptional()
  @ArrayUnique()
  readonly roles?: string[];
}
