import { copy } from "esbuild-plugin-copy";
import { IO } from "../scripts/io.mjs";
import esBuildServer from "esbuild-server";

(async () => {
  // await Commands.run("npm run buildAssets");

  IO.ensureFolderExists("./dist/assets/audio/");

  const server = await esBuildServer.createServer({
      bundle: true,
      entryPoints: ["src/App.ts"],
      outfile: "dist/index.js",
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
    },
    {
      static: "dist",
    });
    console.log("Starting devserver");
    await server.start()
    console.log("Devserver running...", server.url);
})();