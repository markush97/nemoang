import { Types } from 'mongoose';

export interface SubPolicy {
  policyname: string;
  resource: string;
  method: string;
  roles: string[];
  users: string[];
}
