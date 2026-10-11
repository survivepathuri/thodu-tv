// Pure-logic tests (src/core). No React Native preset needed, so this runs
// anywhere babel-jest runs.
module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {'^.+\.(js|jsx|ts|tsx)$': 'babel-jest'},
  testMatch: ['<rootDir>/src/core/**/__tests__/**/*.test.ts'],
  testEnvironment: 'node',
};
