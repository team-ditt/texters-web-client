module.exports = {
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  overrides: [
    {
      files: ["src/**/*.ts", "src/**/*.tsx"],
      rules: {
        "@typescript-eslint/no-shadow": ["off"],
        "no-shadow": "off",
        "no-undef": "off",
      },
    },
  ],
  rules: {
    "react-native/no-inline-styles": [0],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [0],
    "react-hooks/exhaustive-deps": [0],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
