/* eslint-disable @typescript-eslint/no-unsafe-call */
// src/cart/dto/add-to-cart.dto.ts
import { IsInt, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ example: 1, minimum: 1, default: 1 })
  @IsInt()
  @Min(1)
  quantity?: number = 1;
}
