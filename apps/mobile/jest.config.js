module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@dingo/types$': '<rootDir>/../../packages/types/src/index.ts',
    '^@dingo/i18n$': '<rootDir>/../../packages/i18n/src/index.ts',
  },
};
