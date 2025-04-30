/** @type {import('jest').Config} */
module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { jsc: { target: 'es2022' } }],
  },
}
