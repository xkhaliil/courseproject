import jseslint from "@eslint/js"
import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"
import tseslint from "typescript-eslint"

/**
 * The ESLint settings every package shares.
 *
 * @param {string} directory The root of the package being linted. The type-aware rules read the tsconfig.json found there.
 */
export default function eslintConfig(directory) {
  return defineConfig([
    globalIgnores(["dist"]),
    {
      files: ["**/*.{ts,tsx}"],
      extends: [
        jseslint.configs.recommended,
        tseslint.configs.recommendedTypeChecked,
      ],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
        parserOptions: {
          projectService: true,
          tsconfigRootDir: directory,
        },
      },
    },
  ])
}
