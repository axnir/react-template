module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  rules:{
    '@typescript-eslint/no-var-requires': 0
  },
  settings: {
    react: {
      pragma: "React",
      fragment: "Fragment",
      version: "detect"
    }
  }
}