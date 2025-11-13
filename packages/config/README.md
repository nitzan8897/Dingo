# @dingo/config

Shared configuration files for the Dingo monorepo.

## Contents

- `eslint-preset.js` - Shared ESLint configuration
- `prettier.config.js` - Shared Prettier configuration
- `tsconfig.base.json` - Base TypeScript configuration

## Usage

### ESLint

In your `.eslintrc.js`:

```javascript
module.exports = {
  extends: ['@dingo/config/eslint-preset']
};
```

### Prettier

In your `prettier.config.js`:

```javascript
module.exports = require('@dingo/config/prettier.config');
```

### TypeScript

In your `tsconfig.json`:

```json
{
  "extends": "@dingo/config/tsconfig.base.json"
}
```
