import path from "path";
import { Commands } from "../scripts/commands.mjs";
import { AsepriteExport } from "./aseprite_export.mjs";
import { IO } from "./io.mjs";

const tempBuildAssetsFolder = "build_assets";
const outputAssetsFolder = path.join("dist", "assets");
const sourceAssetsFolder = "assets";

(async () =>
{
    IO.ensureFolderExists(tempBuildAssetsFolder);

    await Commands.exportTiledTilesets(path.join(sourceAssetsFolder, "tiled", "tilesets"), path.join(tempBuildAssetsFolder, "tilesets"));
    await Commands.exportTiledMaps(path.join(sourceAssetsFolder, "tiled", "levels"), path.join(tempBuildAssetsFolder, "levels"));
    await AsepriteExport.exportAllFolders(path.join(sourceAssetsFolder, "aseprite"), tempBuildAssetsFolder);

    IO.ensureFolderExists(outputAssetsFolder);
    const folders = await IO.getSubFolders(tempBuildAssetsFolder);
    for (let i = 0; i < folders.length; i++)
    {
        if (!folders[i].startsWith("_"))
        {
            await IO.copyAllFilesFromFolder(path.join(tempBuildAssetsFolder, folders[i]), path.join(outputAssetsFolder, folders[i]));
        }
    }
})();