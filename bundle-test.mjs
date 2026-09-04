import { build } from 'vite';

async function run() {
  await build({
    build: {
      ssr: 'src/engine/verify-tests.ts',
      outDir: 'dist-test',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'test-bundle.mjs',
          format: 'esm',
        }
      }
    }
  });
}

run();
