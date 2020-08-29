import { Types } from 'mongoose';
import { SubPolicy } from '../interfaces/subPolicy.interface';
import { IsString, IsOptional, ArrayUnique } from 'class-validator';

export class AddPolicyDto {
  @IsString()
  readonly policyname: string;

  @IsOptional()
  @ArrayUnique()
  readonly subPolicies: SubPolicy[];

  readonly parent: Types.ObjectId;
}
