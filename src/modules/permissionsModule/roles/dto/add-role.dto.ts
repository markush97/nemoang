import { IsString } from 'class-validator';

export class AddRoleDto {
  @IsString()
  readonly rolename: string;
}
