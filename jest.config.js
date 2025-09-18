const { TextEncoder, TextDecoder } = require('util');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: './jest.custom-environment.js',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['<rootDir>/tests/**/*.(test|spec).(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest'],
  },
  //   TextEncoder和TextDecoder在JSDOM中不可用，所以需要手动引入，测试环境在执行 setup 文件之前，就已经需要这个 API 了。
  globals: {
    // This is kept for environments that might not use the custom environment,
    // but the primary solution is the custom environment itself.
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
  },
  collectCoverageFrom: ['src/**/*.(ts|tsx)', '!src/**/*.d.ts', '!src/index.tsx', '!src/wdyr.tsx'],
  //   生成覆盖率报告的路径
  coverageDirectory: 'reports/jest-coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  reporters: [
    'default',
    [
      'jest-stare',
      {
        resultDir: 'reports/jest-stare',
        reportTitle: 'Jest Test Results',
        //   jest-stare的引用覆盖率的路径
        coverageLink: '../jest-coverage/lcov-report/index.html',
      },
    ],
  ],
};
