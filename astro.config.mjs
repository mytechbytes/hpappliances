// @ts-check
import { defineConfig } from 'astro/config';
import { createLogger } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// We pin Vite 8 (via package.json overrides) while Astro 6.4.7 still declares
// vite ^7.3.2 internally. Astro's own plugins therefore emit harmless Vite-8
// deprecation notices (optimizeDeps.esbuildOptions → rolldownOptions,
// transformWithEsbuild → transformWithOxc). They don't affect the build or its
// output, so we filter just those strings to keep the log clean — once Astro
// targets Vite 8 these can be removed.
const NOISE = ['optimizeDeps.esbuildOptions', 'rolldownOptions', 'transformWithEsbuild', 'transformWithOxc'];
const isNoise = (m) => typeof m === 'string' && NOISE.some((n) => m.includes(n));

// Vite logger path (the [WARN] [vite] … lines).
const logger = createLogger();
const baseWarn = logger.warn.bind(logger);
logger.warn = (msg, opts) => { if (!isNoise(msg)) baseWarn(msg, opts); };

// Raw console path (Vite core prints transformWithEsbuild via console.warn).
const baseConsoleWarn = console.warn.bind(console);
console.warn = (...args) => { if (!isNoise(args[0])) baseConsoleWarn(...args); };

// https://astro.build/config
export default defineConfig({
  // Clean .html URLs (e.g. /products/contura.html) to match a classic
  // static-site layout. Switch to the default 'directory' for /products/contura/.
  build: { format: 'file' },
  server: { port: 5173 },
  vite: {
    customLogger: logger,
    plugins: [tailwindcss()],
  },
});
