/**
 * @type {import("prettier").Config}
 */
const config = {
  tabWidth: 2,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  printWidth: 80,
  bracketSpacing: true,
  useTabs: false,
  quoteProps: 'as-needed',
  arrowParens: 'always',
  requirePragma: false,
  endOfLine: 'auto',
  embeddedLanguageFormatting: 'auto',
  singleAttributePerLine: true,
  bracketSameLine: false,
};

module.exports = config;
