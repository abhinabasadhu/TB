import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      js: pluginJs,
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Custom rules or overrides
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": "error",
      // Add more rules here
    },
    ...pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
  },
];