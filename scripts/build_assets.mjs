import { commands } from "../scripts/commands.mjs";

(async () =>
{
    await commands.exportTiledTilesets("assets/maps/tilesets/", "build_assets/tilesets/");
    await commands.exportTiledMaps("assets/maps/levels/", "build_assets/levels/");
})();