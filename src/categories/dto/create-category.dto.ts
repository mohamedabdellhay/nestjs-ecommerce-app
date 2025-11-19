/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/categories/dto/create-category.dto.ts
import { IsString, IsInt, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'category name',
    example: 'Electronics',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'parent category ID (if it is a subcategory)',
    example: null,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiPropertyOptional({
    description: 'category image URL',
    example: 'https://example.com/category.jpg',
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  image?: string;
}
