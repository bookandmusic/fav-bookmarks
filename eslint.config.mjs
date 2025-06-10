import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintPluginPrettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import nextEslintPlugin from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // ✅ 使用旧的共享配置，如 next/core-web-vitals
  ...compat.extends("next/core-web-vitals", "plugin:@typescript-eslint/recommended", "prettier"),

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "prettier": eslintPluginPrettier,
      "simple-import-sort": simpleImportSort,
      "@next": nextEslintPlugin,
    },
    rules: {
      // ✅ Prettier 格式化
      "prettier/prettier": "error",

      // ✅ 导入排序
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // ✅ 类型检查相关规则
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // ✅ JS 基础规则
      "no-console": "warn",
      "no-debugger": "error",

      // ✅ Next.js 规则增强
      "@next/next/no-img-element": "warn",
      "@next/next/google-font-display": "warn",
    },
  },
];
