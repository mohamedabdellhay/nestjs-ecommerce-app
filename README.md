# E-Commerce API (NestJS + Prisma + PostgreSQL)

**A complete, production-ready e-commerce backend** built by **Mohamed Abdellhay** in November 2025  
Fully functional store for Next.js frontend or mobile app.

## Features

- User Registration & Login (JWT + bcrypt)
- Role-based access (USER / ADMIN)
- Full Products CRUD + Advanced Filtering (price, color, size, category, search, sort, pagination)
- Nested Categories (tree structure)
- Product Attributes (color, size, material, etc.)
- Smart Cart System  
  → Works for guests (cookie-based)  
  → Auto-merge when user logs in  
  → Add / Update quantity / Remove / Clear
- Orders System  
  → Checkout from cart  
  → User order history  
  → Admin panel: view all orders + update status (PENDING → SHIPPED → DELIVERED, etc.)
- Swagger UI with full Arabic/English documentation
- Global Validation + Error Handling
- CORS enabled for frontend on any port
- Soft delete for products
- Ready for image upload (Cloudinary integration ready)
- Seed script with real English data

## Tech Stack

- NestJS 10+
- TypeScript
- Prisma ORM
- PostgreSQL
- Swagger (OpenAPI)
- JWT Authentication
- Bcrypt hashing
- Class Validator + Class Transformer

## Quick Start (Local)

1. Clone & install

   ```bash
   git clone https://github.com/mohamedabdellhay/nestjs-ecommerce-app
   cd nestjs-ecommerce-app
   npm install
   ```

2. Setup PostgreSQL & .env

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ecommerce?schema=public"
   JWT_SECRET=your-super-secret-jwt-key-2025-mohamed
   PORT=3001
   ```

3. Run migrations & seed data

   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx ts-node seed.ts   # English realistic data + admin + customer
   ```

4. Start server

   ```bash
   npm run start:dev
   ```

5. Open Swagger
   → http://localhost:3001/api/v1

## Test Accounts (from seed)

| Role     | Email                | Password |
| -------- | -------------------- | -------- |
| Admin    | admin@store.com      | admin123 |
| Customer | customer@example.com | 123456   |

## API Endpoints (Full List)

See `API_ROUTES.txt` or visit Swagger UI: http://localhost:3001/api/v1

## Scripts

```bash
npm run start        # production
npm run start:dev    # development (watch mode)
npm run build        # compile TypeScript
npx prisma studio    # visual database editor
npx ts-node seed.ts  # fill database with real data
```

## Author

**Mohamed Abdellhay**
Backend Developer | NodeJs| express | NestJS<br />
GitHub: https://github.com/mohamedabdellhay<br />
LinkedIn: https://linkedin.com/in/mohamedabellhay
