module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
  },
  "extends": [
    "airbnb",
    "prettier",
    "prettier/react"
  ],
  "plugins": [
    "react",
    "prettier"
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "version": 6,
      "jsx": true
    }
  },
  "rules": {
    "class-methods-use-this": [
      "error",
      {"exceptMethods": ["reduce", "getInitialState"]}
    ],
    "consistent-return": [
      "error",
      {"treatUndefinedAsUnspecified": true }
    ],
    // todo: don't cheat these issues
    "import/no-extraneous-dependencies": 0,
    "import/no-webpack-loader-syntax": 0,
    "import/no-unresolved": 0
  }
}
