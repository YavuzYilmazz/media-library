import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../middlewares/auth.middleware';
import { MediaService } from '../services/media.service';
import {
  MediaPermissionDto,
  MediaQueryDto,
} from '../validators/media.validator';
import * as fs from 'fs';

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a media file (JPEG only)' })
  @ApiResponse({
    status: 201,
    description: 'Media uploaded successfully',
    schema: {
      example: {
        id: '507f1f77bcf86cd799439012',
        ownerId: '507f1f77bcf86cd799439011',
        fileName: 'image.jpg',
        mimeType: 'image/jpeg',
        size: 1024000,
        allowedUserIds: [],
        createdAt: '2023-09-05T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file type or size',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async uploadMedia(@UploadedFile() file: any, @Request() req) {
    const media = await this.mediaService.uploadMedia(file, req.user);
    return {
      id: media._id,
      ownerId: media.ownerId,
      fileName: media.fileName,
      mimeType: media.mimeType,
      size: media.size,
      allowedUserIds: media.allowedUserIds,
      createdAt: media.createdAt,
    };
  }

  @Get('my')
  @ApiOperation({ summary: "Get current user's media files" })
  @ApiResponse({
    status: 200,
    description: 'Media list retrieved successfully',
    schema: {
      example: {
        media: [
          {
            id: '507f1f77bcf86cd799439012',
            ownerId: '507f1f77bcf86cd799439011',
            fileName: 'image.jpg',
            mimeType: 'image/jpeg',
            size: 1024000,
            allowedUserIds: [],
            createdAt: '2023-09-05T10:30:00Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getUserMedia(@Query() query: MediaQueryDto, @Request() req) {
    const page = parseInt(query.page?.toString() || '1') || 1;
    const limit = parseInt(query.limit?.toString() || '10') || 10;

    const result = await this.mediaService.getUserMedia(req.user, page, limit);

    return {
      media: result.media.map(media => ({
        id: media._id,
        ownerId: media.ownerId,
        fileName: media.fileName,
        mimeType: media.mimeType,
        size: media.size,
        allowedUserIds: media.allowedUserIds,
        createdAt: media.createdAt,
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get media file details' })
  @ApiResponse({
    status: 200,
    description: 'Media details retrieved successfully',
    schema: {
      example: {
        id: '507f1f77bcf86cd799439012',
        ownerId: '507f1f77bcf86cd799439011',
        fileName: 'image.jpg',
        mimeType: 'image/jpeg',
        size: 1024000,
        allowedUserIds: [],
        createdAt: '2023-09-05T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Access denied',
  })
  @ApiResponse({
    status: 404,
    description: 'Media not found',
  })
  async getMedia(@Param('id') id: string, @Request() req) {
    const media = await this.mediaService.getMediaById(id, req.user);
    return {
      id: media._id,
      ownerId: media.ownerId,
      fileName: media.fileName,
      mimeType: media.mimeType,
      size: media.size,
      allowedUserIds: media.allowedUserIds,
      createdAt: media.createdAt,
    };
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download media file' })
  @ApiResponse({
    status: 200,
    description: 'Media file downloaded successfully',
    headers: {
      'Content-Type': {
        description: 'MIME type of the file',
        schema: { type: 'string' },
      },
      'Content-Disposition': {
        description: 'Attachment with filename',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Access denied',
  })
  @ApiResponse({
    status: 404,
    description: 'Media not found',
  })
  async downloadMedia(
    @Param('id') id: string,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { filePath, fileName, mimeType } =
      await this.mediaService.getMediaFile(id, req.user);

    const file = fs.createReadStream(filePath);

    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    return new StreamableFile(file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete media file' })
  @ApiResponse({
    status: 204,
    description: 'Media deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only owner can delete',
  })
  @ApiResponse({
    status: 404,
    description: 'Media not found',
  })
  async deleteMedia(@Param('id') id: string, @Request() req) {
    await this.mediaService.deleteMedia(id, req.user);
  }

  @Get(':id/permissions')
  @ApiOperation({ summary: 'Get media file permissions' })
  @ApiResponse({
    status: 200,
    description: 'Permissions retrieved successfully',
    schema: {
      example: {
        ownerId: '507f1f77bcf86cd799439011',
        allowedUserIds: [
          '507f1f77bcf86cd799439013',
          '507f1f77bcf86cd799439014',
        ],
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only owner can view permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Media not found',
  })
  async getPermissions(@Param('id') id: string, @Request() req) {
    return this.mediaService.getMediaPermissions(id, req.user);
  }

  @Post(':id/permissions')
  @ApiOperation({ summary: 'Manage media file permissions' })
  @ApiResponse({
    status: 200,
    description: 'Permissions updated successfully',
    schema: {
      example: {
        id: '507f1f77bcf86cd799439012',
        ownerId: '507f1f77bcf86cd799439011',
        fileName: 'image.jpg',
        allowedUserIds: ['507f1f77bcf86cd799439013'],
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only owner can manage permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Media not found',
  })
  async managePermissions(
    @Param('id') id: string,
    @Body() permissionDto: MediaPermissionDto,
    @Request() req,
  ) {
    const media = await this.mediaService.managePermissions(
      id,
      permissionDto.userId,
      permissionDto.action,
      req.user,
    );

    return {
      id: media._id,
      ownerId: media.ownerId,
      fileName: media.fileName,
      allowedUserIds: media.allowedUserIds,
    };
  }
}
