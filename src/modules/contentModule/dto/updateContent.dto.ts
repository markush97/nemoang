import { IsString, Allow, ValidationSchema, IsInstance } from 'class-validator';

export class UpdateContentDto {
  @IsString()
  contentName: string;

  // TODO: @IsInstance(MongoSchemaStructure)
  @Allow()
  structure: object;

  // TODO: @IsInstance(ValidationSchema['properties'])
  @Allow()
  validator: ValidationSchema;
}
