/** @type {import('jest').Config} */
export default ({
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { jsc: { target: 'es2022' } }],
  },
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/dist/',
    '/\\.[^/]+/',   // matches “/.[whatever]/” anywhere in the path
  ],
  transformIgnorePatterns: [
    '<rootDir>/dist/',
    '/\\.[^/]+/',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
}) 
