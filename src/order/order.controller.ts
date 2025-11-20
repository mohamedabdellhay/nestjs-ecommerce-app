/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // For client
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('checkout')
  @ApiOperation({ summary: 'Complete checkout and create order' })
  checkout(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.orderService.checkout(req, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my-orders')
  @ApiOperation({ summary: 'Get all my orders' })
  getMyOrders(@Req() req: any) {
    return this.orderService.findAllForUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('my-orders/:id')
  @ApiOperation({ summary: 'Get details of one of my orders' })
  getMyOrder(@Param('id') id: string, @Req() req: any) {
    return this.orderService.findOneForUser(id, req.user.sub);
  }

  // For admin only
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get('admin')
  @ApiOperation({ summary: '[ADMIN] Get all orders' })
  findAllAdmin() {
    return this.orderService.findAllAdmin();
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Get('admin/:id')
  @ApiOperation({ summary: '[ADMIN] Get details of one order' })
  findOneAdmin(@Param('id') id: string) {
    return this.orderService.findOneAdmin(id);
  }

  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @Patch('admin/:id/status')
  @ApiOperation({ summary: '[ADMIN] Update order status' })
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.orderService.updateStatus(id, status);
  }
}
