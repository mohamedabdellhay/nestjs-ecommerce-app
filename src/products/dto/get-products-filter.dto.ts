// src/products/dto/get-products-filter.dto.ts
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsPositive,
  IsString,
  IsNumber,
  IsArray,
  IsIn,
} from 'class-validator';

export class GetProductsFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  // ده المهم: يحول color=black أو color=black&color=red → string[]
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsString({ each: true })
  color?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  @IsString({ each: true })
  size?: string[];

  @IsOptional()
  @IsIn(['latest', 'price-asc', 'price-desc', 'name'])
  sort?: 'latest' | 'price-asc' | 'price-desc' | 'name' = 'latest';

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 20;
}
