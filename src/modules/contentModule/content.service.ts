import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Model, Schema } from 'mongoose';
import { DynamicContent } from './interfaces/content.interface';
import * as mongoose from 'mongoose';
import { UpdateContentDto } from './dto/updateContent.dto';
import {
  validate,
  ValidationSchema,
  registerSchema,
  ValidationTypes,
} from 'class-validator';
import { doesNotReject, rejects, throws } from 'assert';
import { PoliciesService } from '@app/permissions/policies/policies.service';
import { GetAllDocumentsResultDto } from './dto/getAllDocumentsResult.dto';

@Injectable()
export class ContentService {
  contentModels: {
    [key: string]: { model: string; validator: ValidationSchema };
  } = {};

  constructor(
    @Inject('ContentModelToken')
    private readonly contentModel: Model<DynamicContent>,
    private readonly policiesService: PoliciesService
  ) {}

  public async findAllSort(
    contentName: string,
    sort: string,
    order: string,
    page: number,
    limit: number
  ): Promise<GetAllDocumentsResultDto> {
    const model = await this.model(contentName);
    const sortObject = {};
    const stype = sort;
    const sdir: number = order === 'desc' ? -1 : 1;

    sortObject[stype] = sdir;

    return {
      items: await model
        .find()
        .sort(sortObject)
        .skip(limit * page)
        .limit(limit)
        .exec(),
      count: await model.countDocuments(),
    };
  }

  public async getDocument(contentName: string, documentid: string) {
    const model = await this.model(contentName);
    return model.findOne({ _id: documentid });
  }

  public async updateDocument(contentName: string, doc): Promise<any> {
    const model = await this.model(contentName);

    return new Promise<any>((resolve, reject) => {
      validate(contentName, doc, { whitelist: false }).then(errors => {
        if (errors.length > 0) {
          throw new BadRequestException();
        } else {
          resolve(
            model.findOneAndUpdate({ _id: doc._id }, doc)
          );
        }
      });
    });
  }

  public async addDocument(contentName: string, doc: any): Promise<any> {
    const model = await this.model(contentName);

    const val_res = await validate(contentName, doc, { whitelist: false });

    if (val_res.length > 0) {
      throw new BadRequestException(val_res);
    } else {
      return model.create(doc);
    }
  }

  public async updateContent(updateContentDto: UpdateContentDto) {
    return this.contentModel.findOneAndUpdate(
      { contentName: updateContentDto.contentName },
      updateContentDto,
      { upsert: true }
    );
  }

  public async addContent(updateContentDto: UpdateContentDto, userId: string) {
    this.policiesService.addPolicy({
      parent: 'DynamicContents',
      policyname: updateContentDto.contentName,
      subPolicies: [
        {
          users: [userId],
          roles: ['admin'],
          policyname: 'Get ContentSchema',
          resource: '/api/content/' + updateContentDto.contentName,
          method: 'get',
        },
        {
          users: [userId],
          roles: ['admin'],
          policyname: 'Add a new Content',
          resource: '/api/content/' + updateContentDto.contentName,
          method: 'post',
        },
        {
          users: [userId],
          roles: ['admin'],
          policyname: 'Update a Content',
          resource: '/api/content/' + updateContentDto.contentName,
          method: 'put',
        },
        {
          users: [userId],
          roles: ['admin'],
          policyname: 'Get a specific Document',
          resource:
            '/api/content/' + updateContentDto.contentName + '/:documentid',
          method: 'get',
        },
        {
          users: [userId],
          roles: ['admin'],
          policyname: 'Frontend',
          resource: '/admin/content/' + updateContentDto.contentName,
          method: 'front',
        },
      ],
    });

    return this.contentModel.create(updateContentDto);
  }

  public async listContents() {
    return this.contentModel.find({});
  }

  private async model(name: string): Model<any> {
    return (await this.modelAndValidator(name)).model;
  }

  private async updateModel(name: string) {

  }

  private async modelAndValidator(name: string) {
    if (this.contentModels[name] && this.contentModels[name].model) {
      return this.contentModels[name];
    } else {
      this.contentModels[name] = await this.getModelAndValidatorByName(name);

      return this.contentModels[name];
    }
  }

  private async getModelAndValidatorByName(name: string): Promise<any> {
    const dbSchema = await this.contentModel
      .findOne({ contentName: name })
      .exec();
    if (!dbSchema) {
      throw new NotFoundException();
    } else {
      const structure = dbSchema.structure;
      return {
        model: this.createDynamicModel(structure, name),
        validator: this.createDynamicValidator(dbSchema.validator, name),
      };
    }
  }

  private async createDynamicModel(
    structure: object,
    contentName: string
  ): Promise<Model<any>> {
    return mongoose.model('content.' + contentName, new Schema(structure));
  }

  private async createDynamicValidator(
    validatorProperties: ValidationSchema['properties'],
    contentName: string
  ): Promise<string> {
    const dynamicValidator: ValidationSchema = {
      name: contentName,
      properties: validatorProperties,
    };
    registerSchema(dynamicValidator);

    return contentName;
  }
}
