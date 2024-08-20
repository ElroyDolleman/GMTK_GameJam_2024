import * as esbuild from "esbuild";
import { copy } from "esbuild-plugin-copy";

await esbuild.build({
    bundle: true,
      entryPoints: ["src/App.ts"],
      outfile: "dist/index.js",
      minify: true,
      plugins: [
        copy({
          // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
          // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
          resolveFrom: "cwd",
          assets: {
            from: ["./assets/audio/*"],
            to: ["./dist/assets/audio/"],
          },
        }),
        copy({
          // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
          // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
          resolveFrom: "cwd",
          assets: {
            from: ["./html/*"],
            to: ["./dist"],
          },
        }),
      ],
}).catch(() => process.exit(1));

console.log("DONE");