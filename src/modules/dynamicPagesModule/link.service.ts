import { Injectable, Inject } from '@nestjs/common';
import { Link } from './interfaces/link.interface';
import { Model } from 'mongoose';
import { CreateLinkDto } from './dto/createLinkDto';
import { UpdateLinkDto } from './dto/updateLinkDto';

@Injectable()
export class LinkService {
  constructor(
    @Inject('LinkModelToken') private readonly linkModel: Model<Link>
  ) {}

  async getAllLinks(): Promise<Link[]> {
    return this.linkModel.find({});
  }

  async getLinkForMenu(menu: string): Promise<Link[]> {
    return this.linkModel.find({menu});

  }

  async createLink(link: CreateLinkDto): Promise<Link> {
    return this.linkModel.create(link);
  }

  async updateLink(link: UpdateLinkDto): Promise<Link> {
    return this.linkModel.findOneAndUpdate({_id: link._id}, {$set: link});
  }
}
