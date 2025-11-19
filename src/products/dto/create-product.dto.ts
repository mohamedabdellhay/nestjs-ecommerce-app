/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/products/dto/create-product.dto.ts
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsArray,
  ValidateNested,
  IsOptional,
  IsUrl,
  IsInt,
  Min,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProductAttributeDto {
  @IsString()
  @ApiProperty({
    description: 'Name of the product attribute',
    example: 'Color',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Value of the product attribute',
    example: 'Red',
  })
  value: string;
}

export class CreateProductDto {
  @IsString()
  @ApiProperty({
    description: 'Title of the product',
    example: 'Smartphone',
  })
  title: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Description of the product',
    example: 'A high-end smartphone with a great camera',
  })
  description?: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Price of the product',
    example: 499.99,
  })
  price: number;

  @IsArray()
  @IsUrl({}, { each: true })
  @ApiProperty({
    description: 'Array of product image URLs',
    example: [
      'https://example.com/product-image1.jpg',
      'https://example.com/product-image2.jpg',
    ],
  })
  images: string[];

  @IsInt()
  @Min(0)
  @ApiProperty({
    description: 'Available stock quantity of the product',
    example: 150,
  })
  stock: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({
    description: 'Category ID to which the product belongs',
    example: 1,
  })
  categoryId: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Indicates if the product is active',
    example: true,
  })
  isActive?: boolean = true;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeDto)
  @ApiProperty({
    description: 'Array of product attributes',
    type: [ProductAttributeDto],
  })
  attributes: ProductAttributeDto[];
}
