import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  Query,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { UpdateContentDto } from './dto/updateContent.dto';
import { AuthGuard } from '@app/permissions/auth/guards/auth.guard';
import { AuthRequirements } from '@app/permissions/auth/decorators/auth-requirement.decorator ';
import { TokenTypeEnum } from '@app/permissions/auth/enums/token-type.enum';
import { CheckParams } from '@app/permissions/auth/decorators/checkParam.decorator';
import { Token } from '@app/permissions/auth/decorators/token.decorator';
import { AccessToken } from '@app/permissions/auth/interfaces/access-token.interface';
import { GetAllDocumentsResultDto } from './dto/getAllDocumentsResult.dto';

@Controller('api/content')
@UseGuards(AuthGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':contentName')
  @AuthRequirements(TokenTypeEnum.CLIENT)
  @CheckParams(1)
  public async getAllContentData(
    @Param('contentName') contentName: string,
    @Query() query
  ): Promise<GetAllDocumentsResultDto> {
    return this.contentService.findAllSort(
      contentName,
      query.sort,
      query.order,
      parseInt(query.page, 10),
      parseInt(query.perPage, 10)
    );
  }

  @Post(':contentName')
  @AuthRequirements(TokenTypeEnum.CLIENT)
  @CheckParams(1)
  public async createContentData(
    @Param('contentName') contentName: string,
    @Body() doc
  ): Promise<any> {
    return this.contentService.addDocument(contentName, doc);
  }

  @Put(':contentName')
  @AuthRequirements(TokenTypeEnum.CLIENT)
  @CheckParams(1)
  public async updateContentData(
    @Param('contentName') contentName: string,
    @Body() doc
  ): Promise<any> {
    return this.contentService.updateDocument(contentName, doc);
  }

  @Get(':contentName/:documentId')
  @AuthRequirements(TokenTypeEnum.CLIENT)
  @CheckParams(1)
  public async getContent(
    @Param('contentName') contentName: string,
    @Param('documentId') documentId: string
  ): Promise<any> {
    return this.contentService.getDocument(contentName, documentId);
  }

  @Get()
  @AuthRequirements(TokenTypeEnum.CLIENT)
  public async listContent(): Promise<any> {
    return this.contentService.listContents();
  }

  @Put()
  @AuthRequirements(TokenTypeEnum.CLIENT)
  public async updateContent(@Body() updateContentDto: UpdateContentDto) {
    return this.contentService.updateContent(updateContentDto);
  }

  @Post()
  @AuthRequirements(TokenTypeEnum.CLIENT)
  public async addContent(
    @Body() updateContentDto: UpdateContentDto,
    @Token() token: AccessToken
  ) {
    return this.contentService.addContent(updateContentDto, token.userId);
  }
}
