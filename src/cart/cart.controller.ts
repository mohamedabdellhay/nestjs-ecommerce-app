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
  ParseIntPipe, // ← مهم
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import express from 'express';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'show current cart' })
  async getCart(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const cart = await this.cartService.getCart(req);
    this.setCartCookie(res, cart.token as string);
    return cart;
  }

  @Post('add')
  @ApiOperation({ summary: 'add product to cart' })
  async addToCart(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
    @Body() dto: AddToCartDto,
  ) {
    const result = await this.cartService.addToCart(req, dto);
    this.setCartCookie(res, result.token as string);
    return result;
  }

  @Patch('quantity')
  @ApiOperation({ summary: 'update product quantity in cart' })
  async updateQuantity(
    @Req() req: express.Request,
    @Body() body: { productId: number; quantity: number },
  ) {
    return this.cartService.updateQuantity(req, body.productId, body.quantity);
  }

  @Delete('remove/:productId')
  @ApiOperation({ summary: 'remove product from cart' })
  async removeFromCart(
    @Req() req: express.Request,
    @Param('productId', ParseIntPipe) productId: number, // ← صح 100%
  ) {
    return this.cartService.removeFromCart(req, productId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'clear the entire cart' })
  async clearCart(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    await this.cartService.clearCart(req);
    res.clearCookie('cart_token');
    return { message: 'Cart has been cleared successfully' };
  }

  private setCartCookie(res: express.Response, token: string) {
    res.cookie('cart_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }
}
