import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.\.spec\.ts$',
  transform: { '^.+\.(t|j)s$': 'ts-jest' },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.)$': '<rootDir>/src/$1',
  },

  coveragePathIgnorePatterns: [
  '/node_modules/',
  'src/main\.ts$',
  'src/app\.module\.ts$',
  '\.module\.ts$',              
  'src/./entities/.',           
  'src/./dto/.',                
  ]
};

export default config;