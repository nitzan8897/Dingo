# @dingo/types

Shared TypeScript types, interfaces, DTOs, and enums for the Dingo platform.

## Contents

- `lawyer.types.ts` - Lawyer entity types and DTOs
- `rating.types.ts` - Rating system types and utilities
- `common.types.ts` - Common API response types

## Usage

```typescript
import { Lawyer, CreateLawyerDTO, RatingVector } from '@dingo/types';

const lawyer: Lawyer = {
  id: '123',
  fullName: 'John Doe',
  city: 'New York',
  specialties: ['CRIMINAL', 'CIVIL'],
  yearsOfExperience: 10,
  ratingVector: {
    professionalism: 95,
    availability: 88,
    empathy: 92,
    cost: 75
  },
  createdAt: new Date(),
  updatedAt: new Date()
};
```

## Building

```bash
pnpm build
```

## Development

```bash
pnpm dev
```
