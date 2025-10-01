# Synapse Monorepo - AI Coding Guide

## Architecture Overview

This is a TypeScript monorepo with 3 packages:

- **`packages/api`**: NestJS backend (port 3001) with Prisma ORM and PostgreSQL
- **`packages/web`**: React + Vite frontend (port 3000) with Rolldown bundler
- **`packages/shared-types`**: Common TypeScript types, DTOs, enums, and API endpoints

## Essential Workflows

### Development Commands

```bash
# Start both frontend and backend simultaneously
npm run dev

# Start individually
npm run dev:web    # Frontend only (port 3000)
npm run dev:api    # Backend only (port 3001)

# Database operations (from packages/api/)
npm run db:generate  # Generate Prisma client
npm run db:push     # Push schema to DB
npm run db:migrate  # Create and run migrations
npm run db:studio   # Open Prisma Studio
```

### Workspace Structure

- Uses npm workspaces with package names: `@synapse/api`, `@synapse/web`, `@synapse/shared-types`
- Cross-package commands: `npm run build -w @synapse/web`
- TypeScript path mapping: `@synapse/shared-types` resolves to `packages/shared-types/src`

## Key Patterns & Conventions

### Type-First Development

- **ALL entities, DTOs, and API contracts** are defined in `packages/shared-types/src/index.ts`
- Prisma schema in `packages/api/prisma/schema.prisma` mirrors these types exactly
- Both frontend and backend import from `@synapse/shared-types`

### DTO Validation Pattern

- **DTOs in `shared-types`**: Define as TypeScript **interfaces** (lightweight, no dependencies)
- **DTOs in `api`**: Organized by domain with **classes** implementing shared-types interfaces
  - Each domain has its own folder: `auth/`, `user/`, `product/`, `integration/`, etc.
  - Each DTO is in a separate file: `create-user.dto.ts`, `update-user.dto.ts`
  - Add `class-validator` decorators for validation
  - Exported via barrel exports (`index.ts` in each folder)
  - Main `dtos/index.ts` re-exports all DTOs organized by domain

**File structure:**

```
packages/api/src/presentation/dtos/
├── index.ts                    # Main barrel export
├── auth/
│   ├── index.ts
│   └── login.dto.ts
├── user/
│   ├── index.ts
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
├── role/
│   ├── index.ts
│   ├── create-role.dto.ts
│   └── update-role.dto.ts
├── product/
│   ├── index.ts
│   ├── create-product.dto.ts
│   └── update-product.dto.ts
├── integration/
│   ├── index.ts
│   ├── create-integration.dto.ts
│   └── update-integration.dto.ts
├── ad-campaign/
│   ├── index.ts
│   ├── create-ad-campaign.dto.ts
│   └── update-ad-campaign.dto.ts
├── daily-ad-metric/
│   ├── index.ts
│   ├── create-daily-ad-metric.dto.ts
│   └── update-daily-ad-metric.dto.ts
├── sale/
│   ├── index.ts
│   ├── create-sale.dto.ts
│   └── update-sale.dto.ts
└── audit-log/
    ├── index.ts
    └── create-audit-log.dto.ts
```

**Example pattern:**

```typescript
// In shared-types/src/index.ts
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

// In api/src/presentation/dtos/user/create-user.dto.ts
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';
import type { CreateUserDto as ICreateUserDto } from '@synapse/shared-types';

export class CreateUserDto implements ICreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Name must not exceed 255 characters' })
  name: string;

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

// In api/src/presentation/dtos/user/index.ts
export * from './create-user.dto';
export * from './update-user.dto';

// In api/src/presentation/dtos/index.ts
export * from './user';
export * from './role';
// ... other domains

// In controllers
import { CreateUserDto } from '../dtos'; // Use local validated class
```

**Common validation decorators:**

- `@IsString()`, `@IsEmail()`, `@IsInt()`, `@IsNumber()`, `@IsEnum()`, `@IsDate()`
- `@IsOptional()` - for optional fields (always first decorator)
- `@MinLength()`, `@MaxLength()` - string length constraints
- `@Min()`, `@Max()` - numeric constraints
- Custom messages: `@IsEmail({}, { message: 'Email must be valid' })`

**Global ValidationPipe** in `main.ts`:

- `whitelist: true` - removes non-decorated properties
- `forbidNonWhitelisted: true` - throws error on extra properties
- `transform: true` - transforms payloads to DTO instances
- `enableImplicitConversion: true` - auto converts types

### Database Schema Patterns

- Uses Prisma with PostgreSQL and custom output directory: `../generated/prisma`
- Snake_case column names (`created_at`, `password_hash`) with camelCase TypeScript interface properties
- Soft deletes with `deletedAt` fields
- Enum values: `SaleStatus` (PENDING, CONFIRMED, CANCELLED, REFUNDED)

### API Structure

- **Centralized endpoint definitions** in `shared-types` via `API_ENDPOINTS` constant
- REST endpoints follow pattern: `/users`, `/users/:id`, `/users/profile`
- Standardized responses: `ApiResponse<T>` and `PaginatedResponse<T>`
- Authentication returns `AuthResponse` with user + token

### Frontend Configuration

- Vite with React and custom alias: `@` → `./src`
- Proxy setup: `/api/*` → `http://localhost:3001`
- Uses Rolldown bundler (`npm:rolldown-vite@7.1.12`) instead of standard Vite

### Entity Relationships

Key domain: Ad campaign management with user-product-integration-sales analytics

- `User` → `Role` (optional), `Product[]`, `Integration[]`, `AdCampaign[]`
- `Product` → `Sale[]`, `AdCampaign[]`
- `Integration` → `AdCampaign[]`, platform API connections
- `AdCampaign` → `DailyAdMetric[]` for analytics
- All entities have audit trails via `AuditLog`

## Development Guidelines

### When Adding New Features

1. **Define types first** in `shared-types/src/index.ts` (entities, DTOs as interfaces, API endpoints)
2. **Create validated DTO classes** in appropriate domain folder within `api/src/presentation/dtos/`
   - Follow naming convention: `create-entity.dto.ts`, `update-entity.dto.ts`
   - Implement corresponding interface from `@synapse/shared-types`
   - Add `class-validator` decorators with descriptive error messages
   - Export from domain's `index.ts`
3. **Update Prisma schema** if database changes needed
4. **Run `npm run db:generate`** after Prisma changes
5. Import types consistently: `import type { TypeName } from '@synapse/shared-types'` for types, `import { DtoName } from '../dtos'` for validated DTOs in controllers

### Code Organization

- Use TypeScript strict mode with decorators enabled
- API follows NestJS patterns with dependency injection
- **DTOs organized by domain** following DDD principles
- One DTO per file with clear, descriptive names
- Barrel exports for clean imports
- Frontend uses React 19 with TypeScript
- Shared ESLint configs per package, root config as fallback

### Testing & Building

- Run tests workspace-wide: `npm run test` (delegates to all packages)
- Build everything: `npm run build` (builds shared-types first, then dependents)
- Type checking: `npm run type-check` across all packages

## Critical Files

- `packages/shared-types/src/index.ts` - Master type definitions (interfaces only)
- `packages/api/src/presentation/dtos/` - Validated DTO classes organized by domain
- `packages/api/src/presentation/dtos/index.ts` - Main barrel export for all DTOs
- `packages/api/prisma/schema.prisma` - Database schema
- `packages/api/src/main.ts` - Global ValidationPipe configuration
- `packages/web/vite.config.ts` - Frontend build & proxy config
- Root `package.json` - Workspace orchestration scripts
