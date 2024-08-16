import { copy } from 'esbuild-plugin-copy';
import { Commands } from "../scripts/commands.mjs";
import esBuildServer from 'esbuild-server';

(async () => {
  // await Commands.run("npm run buildAssets");

  const server = await esBuildServer.createServer({
      bundle: true,
      entryPoints: ['src/app.ts'],
      outfile: 'dist/index.js',
      plugins: [
        copy({
          // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
          // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
          resolveFrom: 'cwd',
          assets: {
            from: ['./html/*'],
            to: ['./dist'],
          },
          watch: true,
        }),
      ],
    },
    {
      static: 'dist',
    });
    console.log("Starting devserver");
    await server.start()
    console.log("Devserver running...", server.url);
})();