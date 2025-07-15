import { Controller, Post, Get, UploadedFile, UseInterceptors, Body, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('category') category?: string,
  ) {
    const image = await this.imagesService.uploadImage(file, category);
    return {
      id: image.publicId || image._id,
      url: image.url,
      filename: image.filename,
      size: image.size,
      type: image.type,
      uploadedAt: image.uploadedAt,
      category: image.category,
    };
  }

  @Get()
  async getImages(
    @Query('category') category?: string,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    const images = await this.imagesService.getImages(category, Number(limit), Number(offset));
    return images.map(image => ({
      id: image.publicId || image._id,
      url: image.url,
      filename: image.filename,
      size: image.size,
      type: image.type,
      uploadedAt: image.uploadedAt,
      category: image.category,
    }));
  }
} 