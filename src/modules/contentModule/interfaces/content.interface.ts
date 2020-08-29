import { ValidationSchema } from 'class-validator';

export interface DynamicContent {
  contentName: string;
  structure: object;
  validator: ValidationSchema['properties'];
}
