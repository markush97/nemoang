import { SubPolicy } from './subPolicy.interface';
import { Types } from 'mongoose';

export interface Policy {
  policyname: string;
  subPolicies: SubPolicy[];
  parent: string;
}
