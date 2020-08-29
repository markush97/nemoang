import { IsString } from 'class-validator';

export class AddSubPolicyDto {
  @IsString()
  readonly defaultRole: string;

  @IsString()
  readonly resource: string;

  @IsString()
  readonly method: string;

  @IsString()
  readonly policyname: string;
}
