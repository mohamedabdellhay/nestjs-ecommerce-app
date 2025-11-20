// src/products/products.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProductDto } from './dto/update-product.dto';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve a list of products with optional filters',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully',
  })
  findAll(@Query() filter: GetProductsFilterDto) {
    console.log('Controller received filters:', filter);
    return this.productsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a single product by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() createDto: CreateProductDto) {
    return this.productsService.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update Product' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a product' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
