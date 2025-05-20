import { defineConfig } from "rollup";
import rollup_resolve from "@rollup/plugin-node-resolve";
import rollup_commonjs from "@rollup/plugin-commonjs";
import rollup_esbuild from "rollup-plugin-esbuild";
import rollup_dts from "rollup-plugin-dts";
import rollup_json from "@rollup/plugin-json";
import rollup_alias from "@rollup/plugin-alias";

import node_module from "node:module";
import path from "node:path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const require = node_module.createRequire(import.meta.url);
const package_json = require("./package.json");

const external = [
  ...node_module.builtinModules,
  ...Object.keys(package_json.dependencies || {}),
  //...Object.keys(pkg.peerDependencies || {}),
];

export default defineConfig([
  {
    input: "src/index.ts",
    external,
    treeshake: { moduleSideEffects: false },
    plugins: [
      rollup_alias({
        entries: [
          { find: /^~\//, replacement: `${path.resolve(__dirname)}/` },
          { find: /^@\//, replacement: `${path.resolve(__dirname, "src")}/` },
        ],
      }),
      rollup_json(),
      rollup_resolve({ preferBuiltins: true }),
      rollup_commonjs(),
      rollup_esbuild({
        target: ["node22", "es2024"],
        tsconfig: "tsconfig.json",
        minify: true,
      }),
    ],
    output: [
      { file: "dist/index.cjs", format: "cjs" },
      { file: "dist/index.mjs", format: "esm" },
    ],
    watch: false, // disable watch for prod builds :contentReference[oaicite:7]{index=7}
  },
  {
    input: "src/index.ts",
    external,
    plugins: [rollup_dts({ respectExternal: true })],
    output: { file: "dist/index.d.ts", format: "esm" },
    watch: false,
  },
]);
