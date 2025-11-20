/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/cart/cart.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  Res,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import express from 'express';
import type { Request } from 'express';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'show cart' })
  async getCart(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const cart = await this.cartService.getCart(req);
    this.setCartCookie(res, cart.token ?? '');
    return cart;
  }

  @Post('add')
  @ApiOperation({ summary: 'add product to cart' })
  async addToCart(
    @Req() req: Request,
    @Res({ passthrough: true }) res: express.Response,
    @Body() dto: AddToCartDto,
  ) {
    // console.log('Adding to cart:', dto);
    // console.log('req', req.cookies);

    const result = await this.cartService.addToCart(req, dto);
    this.setCartCookie(res, result.token ?? '');
    return result;
  }

  @Patch('quantity')
  @ApiOperation({ summary: 'update product quantity in cart' })
  async updateQuantity(
    @Req() req: express.Request,
    @Body('productId', ParseIntPipe) productId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateQuantity(req, productId, quantity);
  }

  @Delete('remove/:productId')
  @ApiOperation({ summary: 'remove product from cart' })
  async removeFromCart(
    @Req() req: express.Request,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeFromCart(req, productId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'clear cart' })
  async clearCart(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    await this.cartService.clearCart(req);
    res.clearCookie('cart_token');
    return { message: 'Cart cleared successfully' };
  }

  private setCartCookie(res: express.Response, token: string) {
    if (token) {
      res.cookie('cart_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }
  }
}
