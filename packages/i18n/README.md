# @dingo/i18n

Internationalization package for Dingo platform.

## Features

- Hebrew (default) and English support
- RTL/LTR text direction support
- Type-safe locale definitions
- Centralized translation management

## Usage

```typescript
import { defaultLocale, getDirection, type Locale } from '@dingo/i18n';

const locale: Locale = 'he';
const direction = getDirection(locale); // 'rtl'
```

## Supported Locales

- `he` - Hebrew (default, RTL)
- `en` - English (LTR)