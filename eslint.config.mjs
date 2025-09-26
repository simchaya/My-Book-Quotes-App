import js from "@eslint/js";
import globals from "globals";
import { configs as tseslintConfigs } from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,           // basic JavaScript rules
  tseslintConfigs.recommended,      // TypeScript rules
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // apply to your code files
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      "react/react-in-jsx-scope": "off",     // not needed for React 17+
      "react/no-unescaped-entities": "off",  // disable apostrophe complaints
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
]);
