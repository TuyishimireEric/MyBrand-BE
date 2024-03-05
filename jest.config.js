// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
// };

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
     '^.+\\.tsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
     'node_modules/(?!(bson)/)',
  ],
 };
 
