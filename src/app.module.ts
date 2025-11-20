import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesService } from './categories/categories.service';
import { ProductsModule } from './products/products.module';
import { ProductsService } from './products/products.service';
import { CartModule } from './cart/cart.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CategoriesModule,
    ProductsModule,
    CartModule,
    PrismaModule,
    AuthModule,
    OrderModule,
  ],
  controllers: [AppController, OrderController],
  providers: [AppService, PrismaService, CategoriesService, ProductsService, OrderService],
})
export class AppModule {}
