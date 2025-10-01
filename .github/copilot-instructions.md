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
- **DTOs in `api`**: Create **classes** in `packages/api/src/presentation/dtos/index.ts` that:
  - Implement the corresponding interface from `@synapse/shared-types`
  - Add `class-validator` decorators for validation
  - Are used in controllers for automatic validation

**Example pattern:**

```typescript
// In shared-types/src/index.ts
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

// In api/src/presentation/dtos/index.ts
import { IsString, IsEmail, MinLength } from 'class-validator';
import type { CreateUserDto as ICreateUserDto } from '@synapse/shared-types';

export class CreateUserDto implements ICreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

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
2. **Create validated DTO classes** in `api/src/presentation/dtos/index.ts` implementing shared-types interfaces
3. **Add validation decorators** using class-validator
4. **Update Prisma schema** if database changes needed
5. **Run `npm run db:generate`** after Prisma changes
6. Import types consistently: `import type { TypeName } from '@synapse/shared-types'` for types, `import { DtoName } from '../dtos'` for validated DTOs in controllers

### Code Organization

- Use TypeScript strict mode with decorators enabled
- API follows NestJS patterns with dependency injection
- Frontend uses React 19 with TypeScript
- Shared ESLint configs per package, root config as fallback

### Testing & Building

- Run tests workspace-wide: `npm run test` (delegates to all packages)
- Build everything: `npm run build` (builds shared-types first, then dependents)
- Type checking: `npm run type-check` across all packages

## Critical Files

- `packages/shared-types/src/index.ts` - Master type definitions (interfaces only)
- `packages/api/src/presentation/dtos/index.ts` - Validated DTO classes with decorators
- `packages/api/prisma/schema.prisma` - Database schema
- `packages/api/src/main.ts` - Global ValidationPipe configuration
- `packages/web/vite.config.ts` - Frontend build & proxy config
- Root `package.json` - Workspace orchestration scripts
