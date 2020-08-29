import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  readonly rolename: string;
}
