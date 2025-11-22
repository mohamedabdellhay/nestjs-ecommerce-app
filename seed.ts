/* eslint-disable @typescript-eslint/no-unused-vars */
// seed.ts - FULL ENGLISH DATA FOR TESTING
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing database...');
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productAttribute.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Database cleared');

  // 1. Create Admin + Regular User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@store.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Store Admin',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: await bcrypt.hash('123456', 10),
      name: 'John Doe',
      phone: '+20123456789',
    },
  });

  console.log(
    '👥 Users created (admin@store.com / admin123) & (customer@example.com / 123456)',
  );

  // 2. Categories (with tree structure)
  const men = await prisma.category.create({
    data: { name: 'Men Fashion', slug: 'men-fashion' },
  });
  const women = await prisma.category.create({
    data: { name: 'Women Fashion', slug: 'women-fashion' },
  });
  const electronics = await prisma.category.create({
    data: { name: 'Electronics', slug: 'electronics' },
  });
  const accessories = await prisma.category.create({
    data: { name: 'Accessories', slug: 'accessories' },
  });

  const tshirts = await prisma.category.create({
    data: { name: 'T-Shirts', slug: 'tshirts', parentId: men.id },
  });

  const phones = await prisma.category.create({
    data: {
      name: 'Smartphones',
      slug: 'smartphones',
      parentId: electronics.id,
    },
  });

  console.log('📂 Categories tree created');

  // 3. 12 Realistic Products
  const products = [
    {
      title: 'Black Cotton T-Shirt',
      price: 29.99,
      stock: 120,
      categoryId: tshirts.id,
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      image:
        'https://via.placeholder.com/600x800/000000/ffffff?text=Black+T-Shirt',
    },
    {
      title: 'White Premium T-Shirt',
      price: 34.99,
      stock: 80,
      categoryId: tshirts.id,
      colors: ['White'],
      sizes: ['M', 'L', 'XL'],
      image:
        'https://via.placeholder.com/600x800/ffffff/000000?text=White+T-Shirt',
    },
    {
      title: 'Classic Blue Jeans',
      price: 79.99,
      stock: 60,
      categoryId: men.id,
      colors: ['Blue'],
      sizes: ['30', '32', '34', '36'],
      image:
        'https://via.placeholder.com/600x800/1e40af/ffffff?text=Blue+Jeans',
    },
    {
      title: 'JBL Flip 6 Bluetooth Speaker',
      price: 129.99,
      stock: 45,
      categoryId: electronics.id,
      colors: ['Black', 'Red', 'Blue'],
      sizes: [],
      image:
        'https://via.placeholder.com/600x800/333333/ffffff?text=JBL+Flip+6',
    },
    {
      title: 'iPhone 16 Pro 256GB',
      price: 1199.99,
      stock: 15,
      categoryId: phones.id,
      colors: ['Black Titanium', 'Desert Titanium'],
      sizes: [],
      image:
        'https://via.placeholder.com/600x800/1e293b/ffffff?text=iPhone+16+Pro',
    },
    {
      title: 'Apple Watch Series 10',
      price: 499.99,
      stock: 30,
      categoryId: accessories.id,
      colors: ['Midnight', 'Starlight'],
      sizes: ['41mm', '45mm'],
      image:
        'https://via.placeholder.com/600x800/222222/ffffff?text=Apple+Watch',
    },
    {
      title: 'Nike Air Max 270',
      price: 149.99,
      stock: 70,
      categoryId: men.id,
      colors: ['White', 'Black/Red'],
      sizes: ['40', '41', '42', '43', '44', '45'],
      image:
        'https://via.placeholder.com/600x800/ffffff/000000?text=Nike+Air+Max',
    },
    {
      title: 'Leather Crossbody Bag',
      price: 89.99,
      stock: 40,
      categoryId: women.id,
      colors: ['Brown', 'Black'],
      sizes: [],
      image:
        'https://via.placeholder.com/600x800/8b4513/ffffff?text=Leather+Bag',
    },
    {
      title: 'Summer Floral Dress',
      price: 69.99,
      stock: 55,
      categoryId: women.id,
      colors: ['Pink', 'Blue'],
      sizes: ['XS', 'S', 'M', 'L'],
      image:
        'https://via.placeholder.com/600x800/ff69b4/ffffff?text=Floral+Dress',
    },
    {
      title: 'Dell XPS 14 Laptop',
      price: 1899.99,
      stock: 8,
      categoryId: electronics.id,
      colors: ['Platinum Silver'],
      sizes: [],
      image: 'https://via.placeholder.com/600x800/c0c0c0/000000?text=Dell+XPS',
    },
    {
      title: 'Wireless Gaming Mouse',
      price: 79.99,
      stock: 100,
      categoryId: electronics.id,
      colors: ['Black'],
      sizes: [],
      image:
        'https://via.placeholder.com/600x800/000000/00ff00?text=Gaming+Mouse',
    },
    {
      title: 'Gold Necklace Set',
      price: 299.99,
      stock: 25,
      categoryId: accessories.id,
      colors: ['Gold'],
      sizes: [],
      image:
        'https://via.placeholder.com/600x800/ffdd00/000000?text=Gold+Necklace',
    },
  ];

  for (const p of products) {
    const attributes: any[] = [];
    p.colors.forEach((c) => attributes.push({ name: 'color', value: c }));
    p.sizes.forEach((s) => attributes.push({ name: 'size', value: s }));

    await prisma.product.create({
      data: {
        title: p.title,
        slug: p.title
          .toLowerCase()
          .replace(/ /g, '-')
          .replace(/[^\w-]/g, ''),
        description: `High quality ${p.title.toLowerCase()} - Comfortable and durable`,
        price: p.price,
        images: [p.image, p.image.replace('?text=', '?text=Back+View+')],
        stock: p.stock,
        categoryId: p.categoryId,
        attributes: { create: attributes },
      },
    });
  }

  console.log('🛍️ 12 realistic English products added');

  // 4. Sample completed order for the customer
  // 4. Sample completed order for the customer - SAFE VERSION
  console.log('📦 Creating sample order...');

  const firstProduct = await prisma.product.findFirst({
    where: { isActive: true },
    orderBy: { id: 'asc' },
  });

  const secondProduct = await prisma.product.findFirst({
    where: { isActive: true, id: { not: firstProduct?.id } },
    orderBy: { id: 'asc' },
  });

  if (!firstProduct || !secondProduct) {
    console.log('⚠️  Not enough products to create sample order');
  } else {
    await prisma.order.create({
      data: {
        userId: customer.id,
        totalAmount: (
          Number(firstProduct.price) * 2 +
          Number(secondProduct.price)
        ).toFixed(2),
        status: 'SHIPPED',
        shippingAddress: {
          name: 'John Doe',
          phone: '+20123456789',
          address: '123 Main Street, Downtown',
          city: 'Cairo',
          country: 'Egypt',
        },
        items: {
          create: [
            {
              productId: firstProduct.id,
              quantity: 2,
              price: firstProduct.price.toString(),
            },
            {
              productId: secondProduct.id,
              quantity: 1,
              price: secondProduct.price.toString(),
            },
          ],
        },
      },
    });

    console.log('📦 Sample order created successfully with real products!');
  }

  console.log('🎉 ENGLISH SEED COMPLETED 100% SUCCESSFULLY!');
  console.log('🔑 Admin → admin@store.com / admin123');
  console.log('🔑 Customer → customer@example.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
