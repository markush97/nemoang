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
import { AuthGuard } from '@app/permissions/auth/guards/auth.guard';
import { LinkService } from './link.service';
import { Link } from './interfaces/link.interface';
import { UpdateLinkDto } from './dto/updateLinkDto';
import { CreateLinkDto } from './dto/createLinkDto';
import { link } from 'fs';

@Controller('api/link')
@UseGuards(AuthGuard)
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get()
  public async getAllLinks(): Promise<Link[]> {
    return this.linkService.getAllLinks();
  }

  @Get(':menu')
  public async getLinksForMenu(@Param('menu') menu: string): Promise<Link[]> {
    return this.linkService.getLinkForMenu(menu);
  }

  @Post()
  public async addLink(@Body() linkDto: CreateLinkDto): Promise<Link> {
    return this.linkService.createLink(linkDto);
  }

  @Put()
  public async updateLink(@Body() linkDto: UpdateLinkDto): Promise<Link> {
    return this.linkService.updateLink(linkDto);
  }
}
