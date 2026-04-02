// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://dawit-sh.github.io',
  base: '/-x.x',
  vite: {
    plugins: [tailwindcss()]
  }
});