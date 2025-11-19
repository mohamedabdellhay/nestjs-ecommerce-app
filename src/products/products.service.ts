/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: GetProductsFilterDto) {
    const {
      search,
      categoryId,
      minPrice,
      maxPrice,
      color,
      size,
      sort = 'latest',
      page = 1,
      limit = 20,
    } = filter;
    console.log('Received filters:', filter);

    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }
    if (categoryId) where.categoryId = categoryId;
    if (minPrice !== undefined) where.price = { ...where.price, gte: minPrice };
    if (maxPrice !== undefined) where.price = { ...where.price, lte: maxPrice };

    if (color || size) {
      where.attributes = {
        some: {
          AND: [
            color ? { name: 'color', value: { in: color } } : {},
            size ? { name: 'size', value: { in: size } } : {},
          ].filter(Boolean),
        },
      };
    }

    let orderBy: any = [{ createdAt: 'desc' }]; // default = latest

    if (sort === 'price-asc') {
      orderBy = [{ price: 'asc' }];
    } else if (sort === 'price-desc') {
      orderBy = [{ price: 'desc' }];
    } else if (sort === 'name') {
      orderBy = [{ title: 'asc' }];
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { name: true, slug: true } },
          attributes: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { name: true, slug: true } },
        attributes: true,
      },
    });
  }
  async create(createDto: CreateProductDto) {
    const { attributes, title, ...rest } = createDto;

    // توليد slug تلقائي من الـ title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    return this.prisma.product.create({
      data: {
        title,
        slug,

        ...rest,
        attributes: {
          create: attributes,
        },
      },
      include: {
        category: { select: { name: true, slug: true } },
        attributes: true,
      },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product Not Found');

    const slug = dto.title
      ? dto.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
      : product.slug;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        slug,
        price: dto.price?.toString(),
        attributes: dto.attributes
          ? { set: [], create: dto.attributes }
          : undefined,
      },
      include: { category: true, attributes: true },
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product Not Found');

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
