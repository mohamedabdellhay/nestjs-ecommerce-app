/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  //  client checkout
  async checkout(request: any, dto: CreateOrderDto) {
    const userId = request.user?.sub;
    const cart = await this.cartService.getCart(request);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    const order = await this.prisma.order.create({
      data: {
        userId,
        totalAmount: totalAmount.toFixed(2),
        shippingAddress: JSON.parse(JSON.stringify(dto.shippingAddress)),
        items: {
          create: cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, title: true, price: true, images: true },
            },
          },
        },
      },
    });

    await this.cartService.clearCart(request);

    return { message: 'Order created successfully', order };
  }

  // Get all orders for the current user
  async findAllForUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: { select: { title: true, images: true, price: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get one order for user
  async findOneForUser(id: string, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found or does not belong to you');
    }

    return order;
  }

  // === Admin Only ===
  async findAllAdmin() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { id: true, email: true, name: true } },
        items: {
          include: { product: { select: { title: true, images: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneAdmin(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        items: { include: { product: true } },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { email: true, name: true } },
        items: { include: { product: { select: { title: true } } } },
      },
    });
  }
}
