module.exports = {
  "plugins": ["stylelint-prettier"],
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-recommended-scss",
    "stylelint-config-prettier"
  ],
  "customSyntax": "postcss-scss",
  "rules": {
    "prettier/prettier": true
  }
};
