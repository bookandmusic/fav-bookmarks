import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginPrettier from "eslint-plugin-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import nextEslintPlugin from "@next/eslint-plugin-next";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      prettier: eslintPluginPrettier,
      "simple-import-sort": simpleImportSort,
      "@next": nextEslintPlugin,
    },
    rules: {
      // ✅ 基础格式化
      "prettier/prettier": [
        "error",
        {
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: true,
          trailingComma: "es5",
          bracketSpacing: true,
          arrowParens: "always",
          endOfLine: "auto",
        },
      ],

      // ✅ 导入排序
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // React/Next 先排序
            ["^react", "^next"],
            // 外部库
            ["^@?\\w"],
            // @ 开头的别名路径
            ["^@"],
            // 项目内相对路径
            ["^\\."],
          ],
        },
      ],
      "simple-import-sort/exports": "error",

      // ✅ 空格控制
      "no-multi-spaces": [
        "error",
        {
          ignoreEOLComments: true,
          exceptions: {
            Property: true,
            VariableDeclarator: true,
            ImportSpecifier: true,
          },
        },
      ],
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": [
        "error",
        {
          max: 1,
          maxBOF: 0,
          maxEOF: 0,
        },
      ],
    },
  },
    eslintPluginUnicorn.configs.recommended,
  {
    rules: {
      "unicorn/better-regex": "warn",
    },
  },
];