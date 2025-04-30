import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import run from '@rollup/plugin-run';
import json from '@rollup/plugin-json';

import node_module from 'node:module'

const require = node_module.createRequire(import.meta.url)
const package_json = require('./package.json')

const external = [
  ...node_module.builtinModules,
  ...Object.keys(package_json.dependencies || {}),
  //...Object.keys(pkg.peerDependencies || {}),
];

export default defineConfig({
  input: 'src/index.ts',
  external,
  plugins: [
    json(),
    resolve({ preferBuiltins: true }),
    commonjs(),
    esbuild({ target: ['node22', 'es2024'], tsconfig: 'tsconfig.json' }),
    run()
  ],
  output: { file: 'dist/dev.cjs', format: 'cjs' },
  watch: {
    clearScreen: true,
    exclude: ['dist/**']
  }
});

