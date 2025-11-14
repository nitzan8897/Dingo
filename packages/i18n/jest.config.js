module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['**/*.ts', '!**/__tests__/**', '!**/node_modules/**'],
  coverageDirectory: '../coverage',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          lib: ['ES2022', 'DOM'],
        },
      },
    ],
  },
};
