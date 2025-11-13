# Dingo API

NestJS-based backend API following Clean Architecture and SOLID principles.

## Architecture

```
Controller → Service → Repository → Database
     ↓          ↓           ↓
   HTTP    Business      Data
  Layer     Logic       Access
```

### Clean Architecture Layers

1. **Presentation Layer** (Controllers)
   - Handles HTTP requests/responses
   - Input validation via DTOs
   - Route definitions

2. **Business Logic Layer** (Services)
   - Core business logic
   - Domain rules
   - Use case orchestration

3. **Data Access Layer** (Repositories)
   - Database operations
   - Query building
   - Data mapping

4. **Infrastructure** (Prisma, Database)
   - External dependencies
   - Database connection
   - ORM

## SOLID Principles Implementation

### Single Responsibility Principle
Each service has one responsibility:
- `HealthService` - Only handles health checks
- `LawyersService` - Only handles lawyer business logic
- `LawyersRepository` - Only handles data persistence

### Open/Closed Principle
Services are open for extension but closed for modification:
```typescript
// Easy to extend with new methods without modifying existing code
class LawyersService {
  async findAll() { ... }
  async create() { ... }
  // Can add new methods without changing existing ones
}
```

### Liskov Substitution Principle
Abstractions are used for dependencies:
```typescript
// Service depends on repository abstraction, not concrete implementation
constructor(private readonly lawyersRepository: LawyersRepository) {}
```

### Interface Segregation Principle
Focused, minimal interfaces:
```typescript
// DTOs are specific to their use case
CreateLawyerDto
LawyerFilterDto
```

### Dependency Inversion Principle
High-level modules depend on abstractions:
```typescript
// Service depends on repository interface, not implementation
LawyersService → LawyersRepository (abstraction)
```

## Setup

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env

# Generate Prisma Client
pnpm prisma:generate

# Push schema to database
pnpm db:push

# Seed database
pnpm db:seed

# Start development server
pnpm dev
```

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm test:cov     # Run tests with coverage
pnpm lint         # Lint code
```

## Project Structure

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── health/
│   │   │   ├── health.controller.ts    # HTTP layer
│   │   │   ├── health.service.ts       # Business logic
│   │   │   └── health.module.ts
│   │   │
│   │   ├── lawyers/
│   │   │   ├── dto/
│   │   │   │   ├── create-lawyer.dto.ts    # Input validation
│   │   │   │   └── lawyer-filter.dto.ts
│   │   │   ├── lawyers.controller.ts       # HTTP layer
│   │   │   ├── lawyers.service.ts          # Business logic
│   │   │   ├── lawyers.repository.ts       # Data access
│   │   │   └── lawyers.module.ts
│   │   │
│   │   └── prisma/
│   │       ├── prisma.service.ts           # Database connection
│   │       └── prisma.module.ts
│   │
│   ├── main.ts                             # Application entry point
│   └── app.module.ts                       # Root module
│
├── prisma/
│   ├── schema.prisma                       # Database schema
│   └── seed.ts                             # Database seeder
│
├── test/                                   # E2E tests
├── Dockerfile                              # Docker configuration
└── package.json
```

## API Endpoints

### Health Check
```
GET /v1/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Get All Lawyers
```
GET /v1/lawyers?specialty=CRIMINAL&city=Boston&minYearsOfExperience=5
```

Response:
```json
[
  {
    "id": "uuid",
    "fullName": "Sarah Johnson",
    "city": "New York",
    "specialties": ["CRIMINAL", "CIVIL"],
    "yearsOfExperience": 15,
    "ratingVector": {
      "professionalism": 95,
      "availability": 88,
      "empathy": 92,
      "cost": 75
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Lawyer
```
POST /v1/lawyers
Content-Type: application/json
```

Request:
```json
{
  "fullName": "John Doe",
  "city": "New York",
  "specialties": ["CRIMINAL", "CIVIL"],
  "yearsOfExperience": 10,
  "ratingVector": {
    "professionalism": 95,
    "availability": 88,
    "empathy": 92,
    "cost": 75
  }
}
```

## Database

### Prisma Commands

```bash
# Generate Prisma Client
pnpm prisma:generate

# Push schema changes
pnpm db:push

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio

# Create migration
npx prisma migrate dev --name migration_name
```

### Schema

```prisma
model Lawyer {
  id                String   @id @default(uuid())
  fullName          String
  city              String
  specialties       String[]
  yearsOfExperience Int
  ratingVector      Json
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov

# Watch mode
pnpm test:watch
```

## Docker

```bash
# Build image
docker build -t dingo-api .

# Run container
docker run -p 3001:3001 \
  -e DATABASE_URL="postgresql://..." \
  dingo-api
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://dingo:dingo123@localhost:5432/dingo?schema=public

# Application
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

## Code Quality

### ESLint
```bash
pnpm lint
```

### Prettier
```bash
pnpm format
```

### Type Checking
```bash
pnpm tsc --noEmit
```
