import { defineConfig } from 'rollup';
import rollup_resolve from '@rollup/plugin-node-resolve';
import rollup_esbuild from 'rollup-plugin-esbuild';
import rollup_json from '@rollup/plugin-json';
import rollup_alias from '@rollup/plugin-alias'
import rollup_run from '@rollup/plugin-run'

import node_module from 'node:module'
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const require = node_module.createRequire(import.meta.url)
const package_json = require('./package.json')

const external = [
  ...node_module.builtinModules,
  ...Object.keys(package_json.dependencies || {}),
  //...Object.keys(pkg.peerDependencies || {}),
];

export default defineConfig({
  input: './src/index.ts',
  external,
  plugins: [
    rollup_json(),
    rollup_alias({
      entries: [
        { find: /^~\//, replacement: `${path.resolve(__dirname)}/` },
        { find: /^@\//, replacement: `${path.resolve(__dirname, 'src')}/` },
      ]
    }),
    rollup_resolve({
      preferBuiltins: true,
      extensions: ['.ts', '.js', '.mjs'],
    }),
    rollup_esbuild({ target: ['node22', 'ES2022'], tsconfig: './tsconfig.json' }),
    rollup_run(),
  ],
  output: {
    file: 'dist/dev.mjs',
    format: 'esm',
    sourcemap: true,
  },
  watch: {
    clearScreen: true,
    exclude: ['dist/**', 'dist', './dist']
  },
});

