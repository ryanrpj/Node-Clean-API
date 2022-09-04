export default {
  roots: ['<rootDir>/src'],
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
} as any
