import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Media, MediaDocument } from '../models/media.model';
import { UserDocument } from '../models/user.model';
import { ConfigService } from '../config/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<MediaDocument>,
    private readonly configService: ConfigService,
  ) {}

  async uploadMedia(file: any, user: UserDocument): Promise<MediaDocument> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (
      !file.mimetype ||
      (!file.mimetype.includes('jpeg') && !file.mimetype.includes('jpg'))
    ) {
      throw new BadRequestException('Only JPEG files are allowed');
    }

    if (file.size > this.configService.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds limit of ${this.configService.maxFileSize} bytes`,
      );
    }

    const uploadDir = this.configService.uploadDir;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}${extension}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, file.buffer);

    const media = new this.mediaModel({
      ownerId: user._id,
      fileName: file.originalname,
      filePath: filePath,
      mimeType: file.mimetype,
      size: file.size,
      allowedUserIds: [],
    });

    return media.save();
  }

  async getUserMedia(
    user: UserDocument,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    media: MediaDocument[];
    total: number;
    page: number;
    limit: number;
  }> {
    const skip = (page - 1) * limit;

    const [media, total] = await Promise.all([
      this.mediaModel
        .find({ ownerId: user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.mediaModel.countDocuments({ ownerId: user._id }),
    ]);

    return {
      media,
      total,
      page,
      limit,
    };
  }

  async getMediaById(id: string, user: UserDocument): Promise<MediaDocument> {
    const media = await this.mediaModel.findById(id).exec();

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    if (!this.hasAccess(media, user)) {
      throw new ForbiddenException('Access denied to this media');
    }

    return media;
  }

  async deleteMedia(id: string, user: UserDocument): Promise<void> {
    const media = await this.mediaModel.findById(id).exec();

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    if (media.ownerId.toString() !== user._id.toString()) {
      throw new ForbiddenException('Only the owner can delete this media');
    }

    if (fs.existsSync(media.filePath)) {
      fs.unlinkSync(media.filePath);
    }

    await this.mediaModel.findByIdAndDelete(id);
  }

  async getMediaPermissions(
    id: string,
    user: UserDocument,
  ): Promise<{
    ownerId: string;
    allowedUserIds: string[];
  }> {
    const media = await this.mediaModel.findById(id).exec();

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    if (media.ownerId.toString() !== user._id.toString()) {
      throw new ForbiddenException('Only the owner can view permissions');
    }

    return {
      ownerId: media.ownerId.toString(),
      allowedUserIds: media.allowedUserIds.map(id => id.toString()),
    };
  }

  async managePermissions(
    id: string,
    userId: string,
    action: 'add' | 'remove',
    user: UserDocument,
  ): Promise<MediaDocument> {
    const media = await this.mediaModel.findById(id).exec();

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    if (media.ownerId.toString() !== user._id.toString()) {
      throw new ForbiddenException('Only the owner can manage permissions');
    }

    const targetUserId = new Types.ObjectId(userId);

    if (action === 'add') {
      if (!media.allowedUserIds.includes(targetUserId)) {
        media.allowedUserIds.push(targetUserId);
      }
    } else {
      media.allowedUserIds = media.allowedUserIds.filter(
        id => id.toString() !== targetUserId.toString(),
      );
    }

    return media.save();
  }

  async getMediaFile(
    id: string,
    user: UserDocument,
  ): Promise<{
    filePath: string;
    fileName: string;
    mimeType: string;
  }> {
    const media = await this.getMediaById(id, user);

    if (!fs.existsSync(media.filePath)) {
      throw new NotFoundException('Media file not found on disk');
    }

    return {
      filePath: media.filePath,
      fileName: media.fileName,
      mimeType: media.mimeType,
    };
  }

  private hasAccess(media: MediaDocument, user: UserDocument): boolean {
    if (media.ownerId.toString() === user._id.toString()) {
      return true;
    }

    return media.allowedUserIds.some(
      allowedId => allowedId.toString() === user._id.toString(),
    );
  }
}
