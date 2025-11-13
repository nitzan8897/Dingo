# Dingo Mobile

React Native mobile app built with Expo.

## Prerequisites

- Node.js 18+
- pnpm
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

## Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Running

### iOS
```bash
pnpm ios
```

### Android
```bash
pnpm android
```

### Web
```bash
pnpm web
```

## Building

For production builds, use EAS Build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Environment

Update the API URL in `app/index.tsx` to point to your backend:

```typescript
const API_URL = 'http://localhost:3001/v1'; // Development
// const API_URL = 'https://api.dingo.com/v1'; // Production
```
