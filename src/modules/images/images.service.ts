import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Image, ImageDocument } from './models/image.model';
import { v2 as cloudinary } from 'cloudinary';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File, category?: string) {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: category || undefined,
      resource_type: 'image',
    });
    const image = new this.imageModel({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      filename: file.originalname,
      size: file.size,
      type: file.mimetype,
      uploadedAt: new Date(),
      category,
    });
    await image.save();
    return image;
  }

  async getImages(category?: string, limit = 10, offset = 0) {
    const filter = category ? { category } : {};
    return this.imageModel.find(filter).skip(offset).limit(limit).sort({ uploadedAt: -1 });
  }
} 