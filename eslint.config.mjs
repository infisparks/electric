import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable rule that warns about usage of "any" type
      "@typescript-eslint/no-explicit-any": "off",
      // You can disable more type-related rules here as needed:
      // "ban-types": "off",
    },
  },
];

export default eslintConfig;
