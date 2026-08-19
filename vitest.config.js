const path = require('node:path');
const {defineConfig} = require('vitest/config');

module.exports = defineConfig({
    resolve: {
        alias: {
            'src@': path.resolve(__dirname, 'src'),
        },
    },
    test: {
        environment: 'node',
        include: ['tests/**/*.test.ts'],
        clearMocks: true,
        restoreMocks: true,
    },
});
