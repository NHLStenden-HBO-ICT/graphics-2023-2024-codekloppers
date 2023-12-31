import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['**/tests/**/*.js'],
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/assets/**',
            '**/classes/**',
        ],
        testTimeout: 20000,
    },
})