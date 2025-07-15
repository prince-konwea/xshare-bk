import { IsString, IsNotEmpty, IsOptional, IsArray, ArrayMinSize, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  imageUrls: string[];

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  price: number;
} 