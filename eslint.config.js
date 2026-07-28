module.exports = [
  {
    rules: {
      "no-unused-vars": "warn",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "frontend/raktsetu-ui/**",
      "backend/**",
      "packages/shared/dist/**",
    ],
  },
];
