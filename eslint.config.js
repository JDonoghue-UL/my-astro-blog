import tseslint from "typescript-eslint"
import eslintPluginAstro from "eslint-plugin-astro"

export default [
  {
    ignores: [
      "dist/**",
      "dist-static/**",
      ".astro/**",
      "cdk/**",
      "cdk.out/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
]