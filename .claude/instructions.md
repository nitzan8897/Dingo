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
- **i18n:** react-i18next 13.5.0 + i18next 23.7.0
- **TypeScript:** 5.4.5

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
│   ├── i18n/                  # i18n configuration
│   └── config/                # Shared configs (ESLint, tsconfig)
├── .claude/
│   └── instructions.md        # This file
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## Shared Packages Strategy

### Philosophy: Platform-Specific UI, Shared Logic

The Dingo monorepo follows a **pragmatic approach** to code sharing:

**✅ DO Share:**
- Business logic (calculations, utilities)
- Type definitions
- API contracts (DTOs, interfaces)
- Configuration (ESLint, tsconfig)
- Translation keys and locale data

**❌ DON'T Share:**
- UI components (React vs React Native)
- Styling (Tailwind vs StyleSheet)
- Platform-specific integrations
- i18n providers (next-intl vs react-i18next)

### Rationale

Web and mobile have fundamentally different rendering systems:
- **Web:** HTML/CSS with Tailwind, shadcn/ui, DOM events
- **Mobile:** React Native components, StyleSheet, touch gestures

Attempting to share UI components leads to:
- Abstraction complexity that harms both platforms
- Compromised user experience
- Difficult maintenance
- Performance issues

**Instead:** Keep UI implementations separate but maintain **consistent patterns** across platforms.

---

### Current Shared Packages

#### 1. `@dingo/types`

**Purpose:** Shared TypeScript types, interfaces, and business logic

**Contents:**
- Entity types (`Lawyer`, `User`, etc.)
- Utility functions (`calculateOverallRating`, validators)
- Enums and constants
- API response types

**Usage:**
```typescript
import { Lawyer, calculateOverallRating } from '@dingo/types';
```

**Rules:**
- Pure TypeScript only (no React, no DOM, no React Native)
- No platform-specific code
- 100% test coverage for utilities
- Type-only imports when possible

---

#### 2. `@dingo/i18n`

**Purpose:** Shared translation keys and locale configuration

**Contents:**
- Locale constants (`he`, `en`)
- Translation JSON files
- Locale utilities (`getDirection`)

**Usage:**

**Web (Next.js with next-intl):**
```typescript
import { useTranslations } from 'next-intl';

const Component = () => {
  const t = useTranslations();
  return <div>{t('common.appName')}</div>;
};
```

**Mobile (React Native with react-i18next):**
```typescript
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();
  return <Text>{t('common.appName')}</Text>;
};
```

**Rules:**
- Translation files must have identical keys across locales
- Namespace structure: `{category}.{key}` (e.g., `lawyer.overall`)
- Platform apps implement their own i18n providers
- `@dingo/i18n` only provides data, not provider logic

---

#### 3. `@dingo/config`

**Purpose:** Shared configuration files

**Contents:**
- ESLint configurations
- TypeScript configurations
- Shared build configs

**Usage:**
```json
{
  "extends": "@dingo/config/eslint"
}
```

**Rules:**
- Base configurations only
- Apps can extend with platform-specific rules
- Keep minimal and non-opinionated

---

### Deprecated Packages

#### ~~`@dingo/ui`~~ (Deprecated)

**Status:** Removed as of 2025-11-14

**Reason:** Attempted to share UI components between Web and Mobile, but this approach doesn't work due to fundamental platform differences:
- Different component primitives (HTML vs React Native)
- Different styling systems (CSS vs StyleSheet)
- Different user interactions (click vs touch)

**Replacement Strategy:**
- Web components in `apps/web/src/components/`
- Mobile components in `apps/mobile/components/`
- Share only business logic via `@dingo/types`

---

### Creating New Shared Packages

**Before creating a new shared package, ask:**

1. **Can this code run on ALL platforms?**
   - ✅ Yes → Consider shared package
   - ❌ No → Keep in platform app

2. **Does it have platform-specific dependencies?**
   - ✅ Yes → Keep in platform app
   - ❌ No → Consider shared package

3. **Is it pure logic or configuration?**
   - ✅ Yes → Good candidate for shared package
   - ❌ No → Keep in platform app

4. **Will sharing reduce duplication significantly?**
   - ✅ Yes → Consider shared package
   - ❌ No → Duplication might be better than abstraction

**Good Candidates:**
- Validation utilities
- Date formatting utilities
- Business calculation logic
- Type definitions
- Constants and enums

**Bad Candidates:**
- UI components
- Hooks that use platform APIs
- Styling utilities
- Navigation logic
- Platform-specific integrations

---

### Pattern Consistency vs Code Sharing

**Prefer pattern consistency over code sharing:**

Instead of forcing shared UI components, maintain **consistent patterns**:

**Example: LawyerCard Component**

**Web implementation:**
```typescript
// apps/web/src/components/lawyer/lawyer-card.tsx
const LawyerCard = ({ lawyer }: LawyerCardProps) => {
  const t = useTranslations();
  const overallRating = calculateOverallRating(lawyer.ratingVector); // Shared logic

  return (
    <div className="card">
      <h3>{lawyer.fullName}</h3>
      {/* Web-specific JSX */}
    </div>
  );
};
```

**Mobile implementation:**
```typescript
// apps/mobile/components/LawyerCard.tsx
const LawyerCard = ({ lawyer }: LawyerCardProps) => {
  const { t } = useTranslation();
  const overallRating = calculateOverallRating(lawyer.ratingVector); // Shared logic

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{lawyer.fullName}</Text>
      {/* Mobile-specific JSX */}
    </View>
  );
};
```

**Notice:**
- ✅ Same component name and props interface
- ✅ Same business logic (`calculateOverallRating` from `@dingo/types`)
- ✅ Same data structure
- ❌ Different rendering (appropriate for each platform)
- ❌ Different styling (appropriate for each platform)

This approach gives you:
- **Consistency:** Easy to understand structure across platforms
- **Flexibility:** Each platform can optimize for its UX
- **Maintainability:** No complex abstraction layers
- **Performance:** No runtime overhead from abstraction

---

### Migration Guide: Shared Logic

**When you find duplicated business logic across platforms:**

1. **Extract to `@dingo/types`:**
```typescript
// packages/types/src/utils/rating.ts
export function calculateOverallRating(vector: RatingVector): number {
  const { professionalism, availability, empathy, cost } = vector;
  return (professionalism + availability + empathy + cost) / 4;
}
```

2. **Update both platforms to use it:**
```typescript
// Both web and mobile
import { calculateOverallRating } from '@dingo/types';
```

3. **Add tests in `@dingo/types`:**
```typescript
// packages/types/src/utils/__tests__/rating.test.ts
describe('calculateOverallRating', () => {
  it('should calculate average of all ratings', () => {
    const vector = { professionalism: 80, availability: 90, empathy: 70, cost: 60 };
    expect(calculateOverallRating(vector)).toBe(75);
  });
});
```

---

### Summary

**Share aggressively:**
- Types
- Business logic
- Utilities
- Constants

**Keep separate:**
- UI components
- Styling
- Platform APIs
- Providers

**Document consistently:**
- Use same naming conventions
- Follow same architectural patterns
- Maintain parallel folder structures where it makes sense

This pragmatic approach keeps the codebase maintainable while allowing each platform to excel at what it does best.

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
   - Components: `lawyer-card.tsx`, `rating-bar.tsx`
   - Styles: `lawyer-card.styles.ts`, `index.styles.ts`
   - Services: `lawyer-service.ts`
   - Hooks: `use-lawyers.ts`
4. **Style Files:** ALWAYS separate styles into `{name}.styles.ts` files, NEVER inline StyleSheet
5. **API Calls:** Must be in dedicated service modules (frontend)
6. **HTTP Clients:**
   - Web: Next.js enhanced `fetch` with caching
   - Mobile: `axios` for all API calls
7. **Environment Config:** API URLs MUST come from `config/env.ts`, NEVER hardcoded inline
8. **Custom Hooks:** Create when a service function is called more than once
9. **Function Style:** Prefer `const` arrow functions over `function` keyword
10. **Type Assertions:** Avoid `as` keyword when possible; use proper typing
11. **E2E Testing:** Playwright tests must cover both Hebrew and English locales

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

- **Tailwind Only:** No inline styles or CSS modules (web)
- **React Native StyleSheet:** Use StyleSheet.create, NEVER inline styles (mobile)
- **Style File Naming:** Always `{component-name}.styles.ts` (e.g., `lawyer-card.styles.ts`)
- **Style File Location:** Co-located with component file
- **Component Variants:** Use `cva` (class-variance-authority) for variants (web only)
- **Theme Variables:** Use CSS variables from shadcn/ui theme (no hardcoded colors) (web)
- **Responsive Design:** Mobile-first approach (base for mobile, `md:` for desktop) (web)
- **Dark Mode:** All components must support dark mode via `next-themes` (web)

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

## Mobile App Architecture

The mobile app follows the **same architectural patterns as the web app** for consistency:

### Service Layer + Custom Hooks Pattern

**Architecture:**
```
Component → Custom Hook → Service → API
```

**Benefits:**
- Separation of concerns
- Reusable state management
- Testable business logic
- Consistent with web app patterns

---

### Service Structure (Mobile)

Services handle all API communication:

```typescript
// File: apps/mobile/services/lawyer-service.ts
import { Lawyer } from '@dingo/types';

const API_URL = 'http://localhost:3001/v1'; // Use env variable in production

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

**Rules:**
- **HTTP Client:** MUST use `axios` for all API calls (not native fetch)
- **Environment Config:** API URLs MUST come from centralized config file (`config/env.ts`), never inline strings
- Service naming: `{resource}-service.ts` (e.g., `lawyer-service.ts`)
- Service location: `apps/mobile/services/`
- Error handling: Services must catch and transform errors
- Loading states: Let hooks handle loading states, not services
- API response types: Always type responses with `@dingo/types`

---

### Custom Hooks (Mobile)

Custom hooks manage state and call services:

```typescript
// File: apps/mobile/hooks/use-lawyers.ts
import { useState, useCallback } from 'react';
import { Lawyer } from '@dingo/types';
import { lawyerService } from '@/services/lawyer-service';

interface FetchLawyersParams {
  specialties?: string[];
  city?: string;
}

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

**Rules:**
- Hook naming: Must start with `use` (e.g., `useLawyers`)
- Hook returns: Return object for multiple values (not array)
- Dependencies: Always include all dependencies in useEffect/useCallback/useMemo
- Hook location: `apps/mobile/hooks/`
- Mirror web app hooks: Keep same API as web for consistency

---

### Component Usage (Mobile)

Components use hooks, never call services directly:

```typescript
// File: apps/mobile/app/index.tsx
import { useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useLawyers } from '@/hooks/use-lawyers';
import LawyerCard from '@/components/LawyerCard';

export default function Index() {
  const { lawyers, loading, error, fetchLawyers } = useLawyers();

  useEffect(() => {
    fetchLawyers();
  }, [fetchLawyers]);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={lawyers}
      renderItem={({ item }) => <LawyerCard lawyer={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
```

**Rules:**
- ❌ NO inline API calls in components
- ✅ USE custom hooks for data fetching
- ✅ USE services only from hooks, never from components
- ✅ MIRROR web app component patterns

---

### i18n Integration (Mobile)

Mobile uses **react-i18next** (different from web's next-intl):

**Setup:**
```typescript
// File: apps/mobile/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@dingo/i18n/locales/en.json';
import he from '@dingo/i18n/locales/he.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      he: { translation: he },
    },
    lng: 'he', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

**Usage in Components:**
```typescript
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

const Component = () => {
  const { t } = useTranslation();

  return <Text>{t('common.appName')}</Text>;
};
```

**Rules:**
- Use same translation keys as web app
- Import translations from `@dingo/i18n/locales/`
- Different API (`useTranslation` vs `useTranslations`)
- Same translation key structure

---

### Folder Structure (Mobile)

```
apps/mobile/
├── app/                      # Expo router pages
│   ├── index.tsx            # Home screen
│   ├── _layout.tsx          # Root layout with i18n provider
│   └── [id].tsx             # Dynamic routes
├── components/              # React Native components
│   ├── LawyerCard.tsx
│   ├── RatingBar.tsx
│   └── CostRating.tsx
├── hooks/                   # Custom hooks
│   ├── use-lawyers.ts
│   └── use-specialty-filter.ts
├── services/                # API services
│   └── lawyer-service.ts
├── i18n/                    # i18n configuration
│   └── config.ts
└── constants/               # App constants
    └── Colors.ts
```

**Rules:**
- Mirror web app folder structure where possible
- Keep components in `components/`
- Keep hooks in `hooks/`
- Keep services in `services/`
- Use kebab-case for all file names

---

### Testing (Mobile)

Follow same testing patterns as web app:

**Unit Tests:**
```typescript
// File: apps/mobile/hooks/__tests__/use-lawyers.test.ts
import { renderHook, waitFor } from '@testing-library/react-native';
import { useLawyers } from '../use-lawyers';
import { lawyerService } from '@/services/lawyer-service';

jest.mock('@/services/lawyer-service');

describe('useLawyers', () => {
  it('should fetch lawyers on mount', async () => {
    const mockLawyers = [{ id: '1', fullName: 'John Doe' }];
    (lawyerService.fetchLawyers as jest.Mock).mockResolvedValue(mockLawyers);

    const { result } = renderHook(() => useLawyers());

    await waitFor(() => {
      expect(result.current.lawyers).toEqual(mockLawyers);
    });
  });
});
```

**Rules:**
- Test hooks in isolation
- Mock services
- Test loading/error states
- Match web app testing patterns

---

### Summary: Web vs Mobile Consistency

| Aspect | Web | Mobile | Shared |
|--------|-----|--------|--------|
| **Service Layer** | ✅ `services/lawyer-service.ts` | ✅ `services/lawyer-service.ts` | Same pattern |
| **Custom Hooks** | ✅ `hooks/use-lawyers.ts` | ✅ `hooks/use-lawyers.ts` | Same API |
| **i18n Library** | next-intl | react-i18next | Different lib, same keys |
| **Translation Keys** | `@dingo/i18n` | `@dingo/i18n` | ✅ Shared |
| **Types** | `@dingo/types` | `@dingo/types` | ✅ Shared |
| **Business Logic** | `calculateOverallRating` | `calculateOverallRating` | ✅ Shared |
| **Components** | HTML + Tailwind | React Native + StyleSheet | Different |
| **Testing** | Jest + Playwright | Jest + React Native Testing Library | Same patterns |

**Goal:** Maximum pattern consistency, platform-appropriate implementation.

---

## API & Services (Web)

### Service Structure

```typescript
// File: src/services/lawyer-service.ts
import { Lawyer } from '@dingo/types';
import { ENV } from '@/config/env';

interface FetchLawyersParams {
  specialties?: string[];
  city?: string;
}

export class LawyerService {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || ENV.API_URL;
  }

  async fetchLawyers(params?: FetchLawyersParams): Promise<Lawyer[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.specialties) {
        queryParams.append('specialties', params.specialties.join(','));
      }
      if (params?.city) {
        queryParams.append('city', params.city);
      }

      const url = `${this.baseUrl}/lawyers?${queryParams.toString()}`;

      // Next.js enhanced fetch with caching
      const response = await fetch(url, {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch lawyers: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  }
}

export const lawyerService = new LawyerService();
```

### Rules

- **HTTP Client:** MUST use Next.js enhanced `fetch` with caching options (not plain fetch or axios)
- **Environment Config:** API URLs MUST come from centralized config file (`config/env.ts`), never inline strings
- **Service Naming:** `{resource}-service.ts` (e.g., `lawyer-service.ts`)
- **Service Location:** `services/` directory in app root
- **Error Handling:** Services must catch and transform errors to user-friendly messages
- **Loading States:** Services should not manage loading states (let hooks handle it)
- **API Response Types:** Always type responses with interfaces from `@dingo/types`
- **Caching:** Use Next.js `fetch` options (`next: { revalidate }`) for data caching

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
