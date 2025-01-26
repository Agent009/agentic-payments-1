import pluginJs from "@eslint/js";
import eslintNextConfig from "eslint-config-neon/next";
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tsESLint from "typescript-eslint";

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tsESLint.configs.recommended,
  ...eslintNextConfig,
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  {
    ignores: ["**/dist/*"],
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          tabWidth: 2,
        },
      ],
      indent: "off", // Turning this off to avoid conflicts with prettier
      semi: ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      "no-empty-function": "off",
      "@typescript-eslint/no-empty-function": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal"],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        },
      },
      next: {
        rootDir: "src",
      },
      react: {
        version: "detect",
      },
    },
  },
];
