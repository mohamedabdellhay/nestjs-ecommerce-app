/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateCategoryDto) {
    const { name, parentId, image } = createDto;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    return this.prisma.category.create({
      data: {
        name,
        slug,
        image: image || null,
        parent: parentId ? { connect: { id: parentId } } : undefined,
      },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findAllTree() {
    const categories = await this.prisma.category.findMany({
      include: { children: { include: { children: true } } },
      orderBy: { id: 'asc' },
    });

    const buildTree = (parentId: number | null = null) => {
      return categories
        .filter((cat) => cat.parentId === parentId)
        .map((cat) => ({
          ...cat,
          children: buildTree(cat.id),
        }));
    };

    return buildTree();
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: { where: { isActive: true }, take: 10 },
      },
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    let slug = category.slug;
    if (dto.name) {
      slug = dto.name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    if (dto.parentId) {
      if (dto.parentId === id)
        throw new BadRequestException('A category cannot be its own parent');
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) throw new NotFoundException('Parent category not found');
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug,
        image: dto.image,
        parent: dto.parentId
          ? { connect: { id: dto.parentId } }
          : { disconnect: true },
      },
      include: { parent: true, children: true },
    });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true, products: true },
    });

    if (!category) throw new NotFoundException('Category not found');
    if (category.children.length > 0 || category.products.length > 0) {
      throw new BadRequestException(
        'Cannot delete a category that has subcategories or products',
      );
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}
