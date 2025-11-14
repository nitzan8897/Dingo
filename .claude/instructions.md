# Dingo Project - Development Guidelines

This document provides comprehensive guidelines for AI-assisted development on the Dingo project. Use this as a reference for architecture, conventions, and best practices.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [PDCA Workflow](#pdca-workflow)
5. [Core Guidelines](#core-guidelines)
6. [TypeScript & Type Safety](#typescript--type-safety)
7. [React Patterns](#react-patterns)
8. [Styling (shadcn/ui + Tailwind)](#styling-shadcnui--tailwind)
9. [API & Services](#api--services)
10. [NestJS Architecture](#nestjs-architecture)
11. [Database & Prisma](#database--prisma)
12. [Testing](#testing)
13. [i18n & Localization](#i18n--localization)
14. [Git & Commits](#git--commits)
15. [Code Quality & Performance](#code-quality--performance)
16. [Security](#security)
17. [Common Commands](#common-commands)

---

## Project Overview

**Dingo** is a lawyer directory platform with:
- Web application (Next.js)
- Mobile application (Expo/React Native)
- REST API backend (NestJS)
- Shared packages for types, UI, and i18n

**Key Features:**
- Bilingual support (Hebrew RTL + English LTR)
- Dark mode support
- Lawyer search and filtering
- FIFA-style rating system

---

## Tech Stack

### Frontend (Web)
- **Framework:** Next.js 15.0.2
- **UI Library:** React 19.0.0
- **Component Library:** shadcn/ui (migration in progress)
- **Styling:** Tailwind CSS 3.4.3
- **i18n:** next-intl 4.5.2
- **Themes:** next-themes 0.4.6
- **TypeScript:** 5.4.5

### Frontend (Mobile)
- **Framework:** Expo 50.0.0
- **Router:** expo-router 3.4.0
- **UI Framework:** React Native 0.73.0

### Backend (API)
- **Framework:** NestJS 10.3.7
- **Database ORM:** Prisma 5.13.0
- **Database:** PostgreSQL 16
- **Validation:** class-validator 0.14.1 + class-transformer 0.5.1
- **Runtime:** Node.js >=18.0.0

### Development Tools
- **Package Manager:** pnpm >=8.0.0
- **Build Tool:** Turbo 1.13.0
- **Linting:** ESLint 8.57.0 + @typescript-eslint
- **Formatting:** Prettier 3.2.5
- **Testing:** Jest 29.7.0 + Playwright 1.56.1
- **Containerization:** Docker + Docker Compose

---

## Project Structure

```
Dingo/
├── apps/
│   ├── web/                    # Next.js web application
│   │   ├── src/
│   │   │   ├── app/           # App router pages
│   │   │   ├── components/    # React components
│   │   │   ├── services/      # API service modules
│   │   │   └── hooks/         # Custom React hooks
│   │   ├── e2e/               # Playwright tests
│   │   └── public/            # Static assets
│   ├── api/                   # NestJS API backend
│   │   ├── src/
│   │   │   ├── modules/       # Feature modules
│   │   │   │   └── lawyers/
│   │   │   │       ├── lawyers.controller.ts
│   │   │   │       ├── lawyers.service.ts
│   │   │   │       ├── lawyers.repository.ts
│   │   │   │       ├── lawyers.module.ts
│   │   │   │       └── dto/   # Data Transfer Objects
│   │   │   └── main.ts
│   │   └── prisma/
│   │       ├── schema.prisma  # Database schema
│   │       └── seed.ts        # Seed data
│   └── mobile/                # Expo mobile app
│       └── app/               # Expo router pages
├── packages/
│   ├── types/                 # Shared TypeScript types
│   ├── ui/                    # Shared UI components
│   ├── i18n/                  # i18n configuration
│   └── config/                # Shared configs (ESLint, tsconfig)
├── .claude/
│   └── instructions.md        # This file
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## PDCA Workflow

This project uses the **Plan-Do-Check-Act (PDCA)** framework for structured, high-quality feature development. When using the PDCA skill, follow this git workflow:

### Git Workflow During PDCA

#### 1. Plan Phase - Create Feature Branch
- **Create new branch** at the start of PDCA process
- **DO NOT publish/push** the branch yet
- Branch naming: `feature/{name}`, `fix/{name}`, or `refactor/{name}`

```bash
git checkout -b feature/lawyer-advanced-search
```

#### 2. Do Phase - Incremental Commits
- **Work in small batches** (every 2-4 steps in the plan)
- **Stop for human verification** after each batch
- **Commit changes** only after human approval
- **DO NOT push** to remote yet

**Workflow:**
```
1. Implement steps 1-3
2. Stop and show human the changes
3. Human verifies → Commit with descriptive message
4. Implement steps 4-6
5. Stop and show human the changes
6. Human verifies → Commit with descriptive message
... repeat until implementation complete
```

**Example commits:**
```bash
git add .
git commit -m "feat(search): add advanced filter UI components"

# After next batch
git add .
git commit -m "feat(search): implement filter logic and API integration"
```

#### 3. Check Phase - Final Verification
- Complete all tests (unit, integration, E2E)
- Run full test suite and verify all pass
- **Commit any test fixes** with human approval
- **DO NOT push** yet

```bash
pnpm test
git add .
git commit -m "test(search): add E2E tests for advanced search"
```

#### 4. Act Phase - Publish & PR
- After completing retrospective and getting human approval:
  1. **Publish the branch** (first push to remote)
  2. **Create pull request**
  3. Human reviews PR before merging

```bash
# After human verification in Act phase
git push -u origin feature/lawyer-advanced-search

# Then create PR
gh pr create --title "Add advanced lawyer search" --body "..."
```

### PDCA Checkpoints (Human Verification Required)

**Stop and ask for human verification:**
1. ✋ **After every 2-4 implementation steps** (Do phase)
2. ✋ **Before each commit** (ensure changes are correct)
3. ✋ **After Check phase completion** (all tests pass)
4. ✋ **Before publishing branch** (Act phase)
5. ✋ **Before creating PR** (Act phase)

### Why This Workflow?

- **Human accountability:** You review and approve all changes
- **Incremental validation:** Catch issues early in small batches
- **Clean history:** Meaningful commits that tell a story
- **Safe experimentation:** Branch stays local until fully verified
- **Quality gate:** Nothing reaches remote without human approval

### Example Full PDCA Session

```bash
# Plan Phase
git checkout -b feature/lawyer-ratings

# Do Phase - Batch 1
# ... AI implements steps 1-3 ...
# Human verifies ✓
git add .
git commit -m "feat(ratings): add rating vector types and validation"

# Do Phase - Batch 2
# ... AI implements steps 4-6 ...
# Human verifies ✓
git add .
git commit -m "feat(ratings): implement rating display component"

# Do Phase - Batch 3
# ... AI implements steps 7-9 ...
# Human verifies ✓
git add .
git commit -m "feat(ratings): add rating calculation service"

# Check Phase
# ... Run all tests ...
# Human verifies all pass ✓
git add .
git commit -m "test(ratings): add unit and E2E tests for rating system"

# Act Phase - After retrospective
# Human approves to publish ✓
git push -u origin feature/lawyer-ratings

# Human approves PR creation ✓
gh pr create --title "Implement lawyer rating system" --body "..."
```

### Important Notes

- **Never push without human approval** during PDCA
- **Always commit after human verification** in Do phase
- **Keep commits atomic and meaningful** (one logical change per commit)
- **Stop frequently** for human review (every 2-4 steps)
- **Branch stays local** until Act phase completion

---

## Core Guidelines

### Critical Rules

1. **UI Framework:** Use shadcn/ui for all components (migration in progress)
2. **File Length:** Maximum 60 lines per file (can exceed if absolutely necessary)
3. **Naming Convention:** kebab-case for all file names and folder names
4. **API Calls:** Must be in dedicated service modules (frontend)
5. **Custom Hooks:** Create when a service function is called more than once
6. **Function Style:** Prefer `const` arrow functions over `function` keyword
7. **Type Assertions:** Avoid `as` keyword when possible; use proper typing
8. **E2E Testing:** Playwright tests must cover both Hebrew and English locales

---

## TypeScript & Type Safety

### Rules

- **Strict Mode:** All code must pass strict TypeScript checking
- **No `any` types:** Use `unknown` or proper types instead
- **Interface over Type:** Prefer `interface` for object shapes, `type` for unions/intersections
- **Explicit Return Types:** Always define return types for exported functions
- **Shared Types:** All DTOs and entities must be in `@dingo/types` package

### Examples

```typescript
// ✅ Good
interface LawyerCardProps {
  lawyer: Lawyer;
  onSpecialtyClick?: (specialty: string) => void;
}

const LawyerCard = ({ lawyer, onSpecialtyClick }: LawyerCardProps): JSX.Element => {
  // Implementation
};

// ❌ Bad
const LawyerCard = ({ lawyer, onSpecialtyClick }: any) => {
  // Implementation
};
```

---

## React Patterns

### Component Structure

```typescript
'use client'; // For client components

import React from 'react';
import { useTranslations } from 'next-intl';
import { Lawyer } from '@dingo/types';

interface LawyerCardProps {
  lawyer: Lawyer;
  onSpecialtyClick?: (specialty: string) => void;
}

/**
 * LawyerCard component
 * Displays lawyer information with ratings
 */
const LawyerCard = ({ lawyer, onSpecialtyClick }: LawyerCardProps): JSX.Element => {
  const t = useTranslations();

  const handleSpecialtyClick = (specialty: string): void => {
    onSpecialtyClick?.(specialty);
  };

  return (
    <div>
      {/* Implementation */}
    </div>
  );
};

export default LawyerCard;
```

### Rules

- **Functional Components Only:** No class components
- **Props Interface Naming:** Always `{ComponentName}Props`
- **Component Organization:** Props interface → Component → Export
- **Client Directive:** Mark client components with `'use client'` at top
- **Destructure Props:** Always destructure props in function signature
- **Event Handlers:** Name as `handle{Action}` (e.g., `handleClick`, `handleSubmit`)
- **Memoization:** Use `React.memo()` for expensive list items only when needed

### Custom Hooks

```typescript
// File: src/hooks/use-lawyers.ts
import { useState, useCallback } from 'react';
import { Lawyer } from '@dingo/types';
import { lawyerService } from '@/services/lawyer-service';

interface UseLawyersReturn {
  lawyers: Lawyer[];
  loading: boolean;
  error: Error | null;
  fetchLawyers: (params?: FetchLawyersParams) => Promise<void>;
}

export const useLawyers = (): UseLawyersReturn => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLawyers = useCallback(async (params?: FetchLawyersParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await lawyerService.fetchLawyers(params);
      setLawyers(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch'));
    } finally {
      setLoading(false);
    }
  }, []);

  return { lawyers, loading, error, fetchLawyers };
};
```

### Hook Rules

- **Hook Naming:** Must start with `use` (e.g., `useLawyers`)
- **Hook Returns:** Return object for multiple values, not array
- **Dependencies:** Always include all dependencies in useEffect/useCallback/useMemo
- **Hook Location:** Place in `hooks/` directory at component level

### State Management

- **Local State First:** Use useState for component-local state
- **Lift State Up:** Share state by lifting to common parent
- **No Prop Drilling:** Max 2 levels; beyond that, use context or composition

---

## Styling (shadcn/ui + Tailwind)

### Rules

- **Tailwind Only:** No inline styles or CSS modules
- **Component Variants:** Use `cva` (class-variance-authority) for variants
- **Theme Variables:** Use CSS variables from shadcn/ui theme (no hardcoded colors)
- **Responsive Design:** Mobile-first approach (base for mobile, `md:` for desktop)
- **Dark Mode:** All components must support dark mode via `next-themes`

### Example

```typescript
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

const Button = ({ variant, size, children }: ButtonProps): JSX.Element => {
  return (
    <button className={cn(buttonVariants({ variant, size }))}>
      {children}
    </button>
  );
};
```

---

## API & Services

### Service Structure

```typescript
// File: src/services/lawyer-service.ts
import { Lawyer } from '@dingo/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchLawyersParams {
  specialties?: string[];
  city?: string;
}

export const lawyerService = {
  fetchLawyers: async (params?: FetchLawyersParams): Promise<Lawyer[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.specialties) {
        queryParams.append('specialties', params.specialties.join(','));
      }
      if (params?.city) {
        queryParams.append('city', params.city);
      }

      const response = await fetch(
        `${API_URL}/lawyers?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch lawyers: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      throw error instanceof Error
        ? error
        : new Error('An unknown error occurred');
    }
  },
};
```

### Rules

- **Service Naming:** `{resource}-service.ts` (e.g., `lawyer-service.ts`)
- **Service Location:** `services/` directory in app root
- **Error Handling:** Services must catch and transform errors to user-friendly messages
- **Loading States:** Services should not manage loading states (let hooks handle it)
- **API Response Types:** Always type responses with interfaces from `@dingo/types`

---

## NestJS Architecture

### Module Structure

Every feature follows a 3-layer architecture:

```
lawyers/
├── lawyers.controller.ts     # HTTP handling
├── lawyers.service.ts        # Business logic
├── lawyers.repository.ts     # Data access
├── lawyers.module.ts         # Module definition
└── dto/
    ├── create-lawyer.dto.ts
    └── lawyer-filter.dto.ts
```

### Controller Example

```typescript
// lawyers.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { LawyersService } from './lawyers.service';
import { LawyerFilterDto } from './dto/lawyer-filter.dto';
import { Lawyer } from '@dingo/types';

@Controller('lawyers')
export class LawyersController {
  constructor(private readonly lawyersService: LawyersService) {}

  @Get()
  async findAll(@Query() filter: LawyerFilterDto): Promise<Lawyer[]> {
    return this.lawyersService.findAll(filter);
  }
}
```

### Service Example

```typescript
// lawyers.service.ts
import { Injectable } from '@nestjs/common';
import { LawyersRepository } from './lawyers.repository';
import { LawyerFilterDto } from './dto/lawyer-filter.dto';
import { Lawyer } from '@dingo/types';

@Injectable()
export class LawyersService {
  constructor(private readonly lawyersRepository: LawyersRepository) {}

  async findAll(filter: LawyerFilterDto): Promise<Lawyer[]> {
    return this.lawyersRepository.findAll(filter);
  }
}
```

### Repository Example

```typescript
// lawyers.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { LawyerFilterDto } from './dto/lawyer-filter.dto';
import { Lawyer } from '@dingo/types';

@Injectable()
export class LawyersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filter: LawyerFilterDto): Promise<Lawyer[]> {
    return this.prisma.lawyer.findMany({
      where: {
        ...(filter.specialties && {
          specialties: { hasSome: filter.specialties },
        }),
        ...(filter.city && { city: filter.city }),
      },
    });
  }
}
```

### DTO Example

```typescript
// dto/create-lawyer.dto.ts
import { IsString, IsArray, IsInt, Min, ArrayMinSize } from 'class-validator';

export class CreateLawyerDto {
  @IsString()
  fullName: string;

  @IsString()
  city: string;

  @IsArray()
  @ArrayMinSize(1)
  specialties: string[];

  @IsInt()
  @Min(0)
  yearsOfExperience: number;
}
```

### Rules

- **Module Structure:** Always use Controller → Service → Repository (3 layers)
- **DTOs for Validation:** All incoming data must have a DTO with class-validator decorators
- **Dependency Injection:** Always use constructor injection
- **Repository Naming:** `{Resource}Repository` (e.g., `LawyersRepository`)
- **Service Methods:** Name CRUD methods: `create`, `findAll`, `findOne`, `update`, `remove`
- **Global Validation:** Already configured; all DTOs auto-validate

### API Routes

- **Global Prefix:** `/v1` (configured in `main.ts`)
- **Base URL:** `http://localhost:3001/v1` (dev)
- **Resource Routes:** RESTful (e.g., `/v1/lawyers`, `/v1/health`)

---

## Database & Prisma

### Schema Location

Single schema: `apps/api/prisma/schema.prisma`

### Example Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Lawyer {
  id                String   @id @default(uuid())
  fullName          String
  city              String
  specialties       String[]
  yearsOfExperience Int
  ratingVector      Json
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([city])
  @@index([specialties])
}
```

### Rules

- **Migration Naming:** Use descriptive names: `pnpm db:push` or `pnpm prisma migrate dev --name add_lawyer_rating`
- **Seed Data:** Keep seed script updated in `prisma/seed.ts`
- **Indexes:** Add indexes for all frequently queried fields
- **Select Fields:** Only select needed fields in queries for performance

### Common Commands

```bash
pnpm db:push           # Push schema changes to DB (dev)
pnpm db:seed           # Seed database
pnpm db:studio         # Open Prisma Studio
```

---

## Testing

### Framework Usage

- **API (NestJS):** Jest for unit tests
- **Web (Next.js):** Jest for unit/integration, Playwright for E2E
- **i18n Package:** Jest for unit tests

### Test File Naming

- **API:** `{name}.spec.ts` (e.g., `lawyers.service.spec.ts`)
- **Web:** `{name}.test.tsx` (e.g., `lawyer-card.test.tsx`)
- **E2E:** `{name}.spec.ts` (e.g., `specialty-filtering.spec.ts`)

### Test File Location

- **API:** Same directory as source file
- **Web:** In `__tests__/` subdirectory
- **E2E:** In `apps/web/e2e/` directory

### Unit Test Example (NestJS)

```typescript
// lawyers.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { LawyersService } from './lawyers.service';
import { LawyersRepository } from './lawyers.repository';

describe('LawyersService', () => {
  let service: LawyersService;
  let repository: LawyersRepository;

  const mockRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LawyersService,
        { provide: LawyersRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<LawyersService>(LawyersService);
    repository = module.get<LawyersRepository>(LawyersRepository);
  });

  it('should return an array of lawyers', async () => {
    const mockLawyers = [{ id: '1', fullName: 'John Doe' }];
    mockRepository.findAll.mockResolvedValue(mockLawyers);

    const result = await service.findAll({});

    expect(result).toEqual(mockLawyers);
    expect(repository.findAll).toHaveBeenCalledWith({});
  });
});
```

### Unit Test Example (React)

```typescript
// __tests__/lawyer-card.test.tsx
import { render, screen } from '@testing-library/react';
import LawyerCard from '../lawyer-card';
import { Lawyer } from '@dingo/types';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('LawyerCard', () => {
  const mockLawyer: Lawyer = {
    id: '1',
    fullName: 'John Doe',
    city: 'Tel Aviv',
    specialties: ['CRIMINAL'],
    yearsOfExperience: 10,
    ratingVector: {},
  };

  it('should render lawyer name', () => {
    render(<LawyerCard lawyer={mockLawyer} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### E2E Test Example (Playwright)

**Critical:** E2E tests must cover both Hebrew and English locales.

```typescript
// e2e/specialty-filtering.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Specialty Filtering', () => {
  test('should filter lawyers in English', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();
    await page.getByText('Criminal Law').click();
    await page.waitForLoadState('networkidle');

    const lawyerCards = page.locator('.shadow-md');
    await expect(lawyerCards.first()).toBeVisible();
  });

  test('should filter lawyers in Hebrew', async ({ page }) => {
    await page.goto('/he');
    await page.waitForLoadState('networkidle');

    const dropdownButton = page.getByRole('button').first();
    await dropdownButton.click();
    await page.getByText('משפט פלילי').click();
    await page.waitForLoadState('networkidle');

    const lawyerCards = page.locator('.shadow-md');
    await expect(lawyerCards.first()).toBeVisible();
  });
});
```

### Rules

- **Test Structure:** Use describe blocks for grouping, clear test names with "should..."
- **Mock External Deps:** Always mock external services, API calls, and i18n
- **E2E Bilingual:** All Playwright tests must test both locales
- **Coverage Target:** Aim for >80% coverage on business logic

### Common Commands

```bash
pnpm test                      # Run all tests
pnpm --filter @dingo/api test  # API tests only
pnpm --filter @dingo/web test  # Web tests only
pnpm test:watch                # Watch mode
pnpm test:coverage             # With coverage
```

---

## i18n & Localization

### Supported Locales

- **Hebrew (he):** RTL, default locale
- **English (en):** LTR

### Translation Key Format

Use namespace.key format:
- `common.appName`
- `search.chooseSpecialties`
- `lawyer.yearsOfExperience`

### Usage in Components

```typescript
import { useTranslations } from 'next-intl';

const Component = () => {
  const t = useTranslations();

  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <p>{t('search.chooseSpecialties')}</p>
    </div>
  );
};
```

### Translation Files

Location: `packages/i18n/locales/{locale}/`

```json
// packages/i18n/locales/en/common.json
{
  "common": {
    "appName": "Dingo"
  },
  "search": {
    "chooseSpecialties": "Choose Specialties"
  }
}
```

### Rules

- **No Hardcoded Text:** All user-facing text must use `useTranslations()` hook
- **RTL Support:** All layouts must work in both LTR and RTL
- **Translation Files:** JSON format in `packages/i18n/locales/{locale}/`

### RTL Utilities

```typescript
import { getDirection } from '@dingo/i18n';

const direction = getDirection('he'); // 'rtl'
const direction = getDirection('en'); // 'ltr'
```

---

## Git & Commits

### Branch Naming

- `feature/{name}` - New features
- `fix/{name}` - Bug fixes
- `refactor/{name}` - Code refactoring
- `docs/{name}` - Documentation updates

### Commit Messages

Use Conventional Commits format:
- `feat(lawyers): add specialty filtering`
- `fix(api): resolve validation error in DTO`
- `refactor(ui): migrate to shadcn/ui components`
- `test(e2e): add Hebrew locale tests`
- `docs(readme): update setup instructions`

### Commit Best Practices

- **Atomic Commits:** One logical change per commit
- **PR Size:** Max 400 lines changed per PR (easier to review)
- **Small Batches:** Prefer small, frequent commits over large changesets

---

## Code Quality & Performance

### ESLint & Prettier

- **ESLint:** Fix all errors before committing (warnings acceptable)
- **Prettier:** Run `pnpm format` before committing
- **Unused Code:** Remove unused imports, variables, and functions immediately

### Code Style

- **No console.log:** Remove before committing (use proper logging)
- **Comments:** Write for "why", not "what" (code should be self-documenting)
- **TODOs:** Use `// TODO: [JIRA-123] description` format with ticket reference

### Performance

- **Image Optimization:** Always use Next.js `<Image>` component
- **Code Splitting:** Use dynamic imports for heavy components:
  ```typescript
  const HeavyComponent = dynamic(() => import('./heavy-component'));
  ```
- **API Pagination:** Implement for lists with >50 items
- **Database Queries:** Select only needed fields in Prisma

---

## Security

### Input Validation

- Validate all user inputs on both frontend and backend
- Use DTOs with class-validator in NestJS
- Sanitize inputs before rendering

### Database Security

- Use Prisma's query builder only (no raw SQL unless necessary)
- Never trust user input in queries

### XSS Protection

- Never use `dangerouslySetInnerHTML`
- Use React's built-in escaping

### Environment Variables

- Never commit `.env` files
- Use `.env.example` for templates
- All secrets must be in environment variables

### CORS

- Keep CORS restrictive (configured for localhost in dev)
- Update for production domains only

---

## Common Commands

### Development

```bash
pnpm dev                          # Start all apps in dev mode
pnpm --filter @dingo/web dev      # Web app only
pnpm --filter @dingo/api dev      # API only
pnpm --filter @dingo/mobile dev   # Mobile only
```

### Building

```bash
pnpm build                        # Build all apps
pnpm --filter @dingo/web build    # Web only
pnpm --filter @dingo/api build    # API only
```

### Testing

```bash
pnpm test                         # All tests
pnpm --filter @dingo/web test     # Web tests
pnpm --filter @dingo/api test     # API tests
pnpm test:watch                   # Watch mode
pnpm test:coverage                # With coverage
```

### Linting & Formatting

```bash
pnpm lint                         # Lint all
pnpm --filter @dingo/web lint     # Web only
pnpm format                       # Format all files
```

### Database

```bash
pnpm db:push                      # Push schema to DB (API only)
pnpm db:seed                      # Seed database (API only)
pnpm db:studio                    # Open Prisma Studio (API only)
```

### Docker

```bash
docker-compose up                 # Start all services
docker-compose up postgres        # Postgres only
docker-compose down               # Stop all services
```

---

## Quick Reference

### File Naming Examples

```
✅ Good:
- lawyer-card.tsx
- use-lawyers.ts
- lawyer-service.ts
- create-lawyer.dto.ts
- lawyer-card.test.tsx

❌ Bad:
- LawyerCard.tsx (PascalCase file)
- useLawyers.ts (camelCase file)
- lawyer_service.ts (snake_case)
```

### Component Template

```typescript
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface ComponentNameProps {
  // Props here
}

/**
 * ComponentName - Brief description
 */
const ComponentName = ({ /* props */ }: ComponentNameProps): JSX.Element => {
  const t = useTranslations();

  // Implementation

  return <div>{/* JSX */}</div>;
};

export default ComponentName;
```

### Service Template

```typescript
import { ResourceType } from '@dingo/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const resourceService = {
  fetchAll: async (): Promise<ResourceType[]> => {
    try {
      const response = await fetch(`${API_URL}/resource`);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error instanceof Error ? error : new Error('Unknown error');
    }
  },
};
```

### Custom Hook Template

```typescript
import { useState, useCallback } from 'react';

interface UseResourceReturn {
  data: ResourceType[];
  loading: boolean;
  error: Error | null;
  fetchData: () => Promise<void>;
}

export const useResource = (): UseResourceReturn => {
  const [data, setData] = useState<ResourceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await resourceService.fetchAll();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed'));
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};
```

---

## Summary

This document provides comprehensive guidelines for the Dingo project. When in doubt:

1. Follow the 60-line file limit
2. Use kebab-case for file/folder names
3. Keep services separate from components
4. Test in both Hebrew and English
5. Use shadcn/ui for all new components
6. Prefer `const` over `function`
7. Avoid `as` keyword
8. Always use TypeScript strict mode

For questions or clarifications, refer to existing code patterns in the codebase or consult the team.

---

**Last Updated:** 2025-11-14
