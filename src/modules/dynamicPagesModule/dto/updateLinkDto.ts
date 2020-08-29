import { IsString, ArrayUnique, IsMongoId, IsOptional } from 'class-validator';
import { Link } from '../interfaces/link.interface';

export class UpdateLinkDto {
  @IsOptional()
  @IsMongoId()
  _id: string;

  @IsOptional()
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  link: string;

  @IsOptional()
  @IsString()
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
