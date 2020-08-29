import { IsString, ArrayUnique, IsOptional } from 'class-validator';
import { Link } from '../interfaces/link.interface';

export class CreateLinkDto {
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  link: string;

  @IsString()
  @IsOptional()
  menu: string;

  @IsOptional()
  @ArrayUnique()
  subMenu: Link[];

  @IsOptional()
  @IsString()
  permission: string;

  @IsOptional()
  @ArrayUnique()
  parameter: string[];
}
