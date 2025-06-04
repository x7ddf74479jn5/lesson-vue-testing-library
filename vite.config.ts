/// <reference types="vitest" />
// @ts-ignore
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  test: {
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    environment: 'happy-dom',
  },
});
