# @dingo/ui

Shared UI components for Dingo web and mobile applications.

## Architecture

This package contains platform-agnostic component logic. The actual rendering is handled by platform-specific implementations in:
- `apps/web` - Next.js/React implementations with TailwindCSS
- `apps/mobile` - React Native implementations

## Components

### LawyerCard
Displays lawyer information with FIFA-style ratings.

```tsx
import { LawyerCard } from '@dingo/ui';

<LawyerCard
  lawyer={lawyer}
  onPress={() => console.log('Card clicked')}
/>
```

### RatingBar
Horizontal bar displaying a rating value (0-100).

```tsx
import { RatingBar } from '@dingo/ui';

<RatingBar
  label="Professionalism"
  value={95}
  color="#10b981"
  showValue={true}
/>
```

### SearchBar
Search and filter interface.

```tsx
import { SearchBar } from '@dingo/ui';

<SearchBar
  onSearch={(query) => console.log(query)}
  onFilterSpecialty={(specialty) => console.log(specialty)}
  onFilterCity={(city) => console.log(city)}
  placeholder="Search lawyers..."
/>
```

## Building

```bash
pnpm build
```

## Development

```bash
pnpm dev
```
