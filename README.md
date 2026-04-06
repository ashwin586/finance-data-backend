# Finance Data Backend

A role-based finance records and dashboard API built with Node.js, TypeScript, Express, and PostgreSQL.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js v5
- **Database**: PostgreSQL
- **ORM**: Prisma v5
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **API Documentation**: Swagger UI
- **Rate Limiting**: express-rate-limit

## Features

- User management with role-based access control (ADMIN, ANALYST, VIEWER)
- Financial records management with filtering, search and pagination
- Dashboard analytics with summary, category breakdown, trends and recent activity
- JWT authentication with token expiry
- Input validation with detailed error messages
- Soft delete for financial records
- Rate limiting to prevent brute force attacks
- Swagger API documentation

## Roles and Permissions

| Action | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| View transactions | ✅ | ✅ | ✅ |
| Create transactions | ❌ | ❌ | ✅ |
| Update transactions | ❌ | ❌ | ✅ |
| Delete transactions | ❌ | ❌ | ✅ |
| View dashboard | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

## Project Structure
src/
├── config/
│   ├── db.ts              # Prisma client
│   └── swagger.ts         # Swagger config
├── middlewares/
│   ├── auth.ts            # JWT verification
│   ├── rbac.ts            # Role based access control
│   ├── validate.ts        # Zod validation
│   └── errorHandler.ts    # Global error handler
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.schema.ts
│   ├── users/
│   │   ├── users.routes.ts
│   │   ├── users.controller.ts
│   │   └── users.service.ts
│   ├── transactions/
│   │   ├── transactions.routes.ts
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── transactions.schema.ts
│   └── dashboard/
│       ├── dashboard.routes.ts
│       ├── dashboard.controller.ts
│       └── dashboard.service.ts
├── types/
│   └── interface.ts       # Custom TypeScript interfaces
├── utils/
│   └── AppError.ts        # Custom error class
└── app.ts

## Getting Started

### Prerequisites

- Node.js v18 or higher
- PostgreSQL installed and running
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ashwin586/finance-data-backend.git
cd finance-data-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your values

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Seed the database with default admin user:
```bash
npx prisma db seed
```

7. Start the development server:
```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Default Admin Credentials
Email: admin@finance.com
Password: admin123

## API Documentation

Swagger UI is available at:
{baseURL}/api/docs

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/users | ADMIN | Get all users |
| GET | /api/users/:id | ADMIN | Get user by ID |
| PATCH | /api/users/:id/role | ADMIN | Update user role |
| PATCH | /api/users/:id/status | ADMIN | Update user status |

### Transactions
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/transactions | ADMIN | Create transaction |
| GET | /api/transactions | ALL | Get all transactions |
| GET | /api/transactions/:id | ALL | Get transaction by ID |
| PATCH | /api/transactions/:id | ADMIN | Update transaction |
| DELETE | /api/transactions/:id | ADMIN | Soft delete transaction |

### Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/dashboard/summary | ADMIN, ANALYST | Total income, expenses, net balance |
| GET | /api/dashboard/by-category | ADMIN, ANALYST | Totals grouped by category |
| GET | /api/dashboard/recent | ADMIN, ANALYST | Last 10 transactions |
| GET | /api/dashboard/trends | ADMIN, ANALYST | Monthly income vs expense |

## Query Parameters

### GET /api/transactions
| Parameter | Type | Description |
|---|---|---|
| type | string | Filter by INCOME or EXPENSE |
| category | string | Filter by category |
| from | string | Filter from date e.g. 2026-01-01 |
| to | string | Filter to date e.g. 2026-12-31 |
| search | string | Search by category or notes |
| page | number | Page number, default 1 |
| limit | number | Records per page, default 10 |

### GET /api/users
| Parameter | Type | Description |
|---|---|---|
| search | string | Search by name or email |
| page | number | Page number, default 1 |
| limit | number | Records per page, default 10 |

## Design Decisions and Assumptions

### Soft Delete
Financial records are never hard deleted. Instead `isDeleted` is set to `true`. This preserves audit trail which is critical in finance systems.

### Role Design
- New users default to `VIEWER` role on registration
- Only ADMIN can promote users to higher roles
- This ensures principle of least privilege

### Category as Free String
Transaction categories are free text strings rather than a fixed enum. This allows flexibility for different types of organizations using the system. Categories are stored in lowercase for consistency.

### userId in Transactions
The `userId` in a transaction represents which admin recorded the entry, not who the money belongs to. This is a company finance dashboard, not a personal expense tracker.

### Rate Limiting
Two rate limiters are implemented:
- General limiter: 100 requests per 15 minutes for all routes
- Auth limiter: 10 requests per 15 minutes for login and register to prevent brute force attacks

### ACID Compliance
Single record operations rely on PostgreSQL's built-in ACID guarantees. For multi-step operations, Prisma's `$transaction` API can be used to ensure atomicity.

## Environment Variables

| Variable | Description |
|---|---|
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret key for JWT signing |
| JWT_EXPIRES_IN | JWT expiry duration e.g. 7d |
| PORT | Server port, default 3000 |

## Technical Tradeoffs

- **Prisma v5 over v7** — Prisma v7 introduced breaking changes in connection management. v5 is stable and production-proven
- **Express v5** — Used for native async error handling, removing the need for try/catch in controllers
- **Modular structure over MVC** — Each feature module contains its own routes, controller and service. This makes the codebase easier to scale and maintain compared to grouping by file type
- **PostgreSQL over MongoDB** — Financial data is relational by nature. PostgreSQL provides better data integrity, ACID compliance and aggregate query support

