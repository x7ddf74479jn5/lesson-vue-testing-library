import js from "@eslint/js";
import prettier from "@vue/eslint-config-prettier";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import importPlugin from "eslint-plugin-import";
import vue from "eslint-plugin-vue";

export default defineConfigWithVueTs([
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  vueTsConfigs.recommendedTypeChecked,
  vue.configs["flat/essential"],
  {
    name: "custom",
    rules: {
      // tscで検知可能なためoff
      "import/default": "off",
      "import/named": "off",
      "import/namespace": "off",
      "import/no-unresolved": "off",

      "no-irregular-whitespace": [
        "error",
        {
          skipComments: true,
          skipRegExps: true,
        },
      ],
      "prefer-const": "error",

      "import/no-mutable-exports": "error",
      "import/newline-after-import": ["error", { count: 1 }],
      "import/order": [
        "error",
        {
          "newlines-between": "always-and-inside-groups",
          pathGroupsExcludedImportTypes: ["builtin"],
          groups: ["builtin", "external", "internal"],
          alphabetize: {
            order: "asc",
          },
        },
      ],

      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-empty-object-type": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/prefer-promise-reject-errors": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-wrapper-object-types": "error",
    },
  },
  prettier,
]);
