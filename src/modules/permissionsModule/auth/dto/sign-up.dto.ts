import { IsEmail, IsOptional, IsString, IsNotIn, Matches, IsAlpha, IsNumberString, IsIn } from 'class-validator';
import { getAlpha3Codes } from 'i18n-iso-countries';

export class SignUpDto {
  @IsEmail()
  readonly email: string;

  @Matches(RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'))
  readonly password: string;

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
  @IsNumberString()
  readonly number: number;

  @IsOptional()
  @IsNumberString()
  readonly stair: number;

  @IsOptional()
  @IsNumberString()
  readonly door: number;

  @IsOptional()
  @IsNumberString()
  readonly zip: number;

  @IsOptional()
  @IsIn(Object.keys(getAlpha3Codes()).map(key => getAlpha3Codes()[key]))
  readonly country: string;

  @IsOptional()
  @IsAlpha()
  readonly city: string;
}
