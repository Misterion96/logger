import configs from '@dolgikh-maks/eslint-config';

const config = [
    ...configs.coreConfig(),
    ...configs.typescriptConfig(),
    {
        files: ['**/*.ts'],
        languageOptions: {
            ecmaVersion: 'latest',
            parserOptions: {
                parser: '@typescript-eslint/parser',
                tsconfigRootDir: import.meta.dirname,
                project: 'tsconfig.eslint.json',
                createDefaultProgram: true,
                allowDefaultProject: true,
            },
        },
        rules: {
            'compat/compat': 'off',
            '@typescript-eslint/no-use-before-define': 'off'
        }
    },
    {
        ignores: ['dist', 'eslint.config.mjs']
    }
];

export default config;
