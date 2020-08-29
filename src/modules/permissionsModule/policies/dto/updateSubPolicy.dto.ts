import {
  IsString,
  ArrayUnique,
  IsMongoId,
  IsArray,
  Allow,
  IsOptional,
} from 'class-validator';

export class UpdateSubPolicyDto {
  @IsOptional()
  @ArrayUnique()
  @IsArray()
  readonly roles?: string[];

  @IsOptional()
  @ArrayUnique()
  @IsArray()
  readonly users?: string[];

  @IsString()
  readonly _id: string;
}
