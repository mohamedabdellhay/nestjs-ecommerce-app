/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Request } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getActiveCart(userId?: number, token?: string) {
    // 1) لو يوزر مسجل دخول
    if (userId) {
      let cart = await this.prisma.cart.findUnique({ where: { userId } });
      if (!cart) {
        cart = await this.prisma.cart.create({ data: { userId } });
      }
      return cart;
    }

    // 2) لو ضيف ومعاه توكن
    if (token) {
      const cart = await this.prisma.cart.findUnique({ where: { token } });
      if (cart) return cart;
    }

    // 3) لو ضيف ومفيش توكن → نعمل واحدة جديدة
    return this.prisma.cart.create({
      data: { token: randomUUID() },
    });
  }

  async mergeCartIfNeeded(userId: number, guestToken?: string) {
    if (!guestToken) return;

    const guestCart = await this.prisma.cart.findUnique({
      where: { token: guestToken },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) return;

    let userCart = await this.prisma.cart.findUnique({ where: { userId } });

    // لو مفيش كارت لليوزر → نحول الضيف لكارت ثابت
    if (!userCart) {
      await this.prisma.cart.update({
        where: { id: guestCart.id },
        data: { userId, token: null },
      });
      return;
    }

    // لو عنده كارت → ندمجهم
    for (const item of guestCart.items) {
      const existing = await this.prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: userCart.id,
            productId: item.productId,
          },
        },
      });

      if (existing) {
        await this.prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + item.quantity },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: userCart.id,
            productId: item.productId,
            quantity: item.quantity,
          },
        });
      }
    }

    // امسح الكارت القديم
    await this.prisma.cart.delete({ where: { id: guestCart.id } });
  }

  async getCart(req: Request) {
    const userId = (req.user as any)?.sub;
    const token =
      req.cookies?.cart_token ||
      (req.headers['x-cart-token'] as string | undefined);

    const cart = await this.getActiveCart(userId, token);

    const fullCart = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                images: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    const items = fullCart?.items ?? [];

    return {
      id: cart.id,
      token: userId ? null : cart.token,
      totalItems: items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: items.reduce(
        (s, i) => s + Number(i.product.price) * i.quantity,
        0,
      ),
      items,
    };
  }

  async addToCart(req: Request, dto: AddToCartDto) {
    const userId = (req.user as any)?.sub;
    const token =
      req.cookies?.cart_token ||
      (req.headers['x-cart-token'] as string | undefined);

    const cart = await this.getActiveCart(userId, token);

    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId, isActive: true },
    });

    if (!product) throw new NotFoundException('المنتج غير موجود');

    const quantity = dto.quantity ?? 1;

    if (product.stock < quantity) {
      throw new BadRequestException('الكمية غير متوفرة');
    }

    const existing = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId: dto.productId },
      },
    });

    if (existing) {
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId: dto.productId, quantity },
      });
    }

    return this.getCart(req);
  }

  async updateQuantity(req: Request, productId: number, quantity: number) {
    if (quantity <= 0)
      throw new BadRequestException('الكمية يجب أن تكون أكبر من صفر');

    const userId = (req.user as any)?.sub;
    const token =
      req.cookies?.cart_token ||
      (req.headers['x-cart-token'] as string | undefined);

    const cart = await this.getActiveCart(userId, token);

    await this.prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity },
    });

    return this.getCart(req);
  }

  async removeFromCart(req: Request, productId: number) {
    const userId = (req.user as any)?.sub;
    const token =
      req.cookies?.cart_token ||
      (req.headers['x-cart-token'] as string | undefined);

    const cart = await this.getActiveCart(userId, token);

    await this.prisma.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    return this.getCart(req);
  }

  async clearCart(req: Request) {
    const userId = (req.user as any)?.sub;
    const token =
      req.cookies?.cart_token ||
      (req.headers['x-cart-token'] as string | undefined);

    const cart = await this.getActiveCart(userId, token);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: 'تم تفريغ السلة بنجاح' };
  }
}
