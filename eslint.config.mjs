import typescriptEslint from "@typescript-eslint/eslint-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/*.json", "**/*.js", "**/*.mjs", "**/*.tsx"],
}, ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    rules: {
        curly: "error",
        "no-new-wrappers": "error",
        "prefer-const": "error",
        "no-constant-condition": "error",
        "no-var": "error",
        "no-empty": "off",
        "space-before-blocks": "off",
        "no-empty-function": "off",
        quotes: ["error", "double"],

        "brace-style": ["error", "allman", {
            allowSingleLine: true,
        }],

        "no-trailing-spaces": "error",
        "no-case-declarations": "off",
        eqeqeq: "error",
        semi: ["error", "always"],
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/prefer-readonly": "off",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/explicit-member-accessibility": "error",

        "@typescript-eslint/typedef": ["error", {
            parameter: true,
        }],
    },
}, {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: ["./tsconfig.json"],
        },
    },
}];