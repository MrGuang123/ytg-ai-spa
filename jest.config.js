module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  testMatch: ['<rootDir>/tests/**/*.(test|spec).(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['@swc/jest'],
  },
  collectCoverageFrom: ['src/**/*.(ts|tsx)', '!src/**/*.d.ts', '!src/index.tsx', '!src/wdyr.tsx'],
  //   生成覆盖率报告的路径
  coverageDirectory: 'reports/jest-coverage',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: [],
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
