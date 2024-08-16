import { packAsync } from "free-tex-packer-core";
import { IO } from "./io.mjs";
import path from "path";
import { Commands } from "./commands.mjs";
import fs from "fs";

export class AsepriteExport
{
    static getAsepriteFiles(sourceFolder)
    {
        return IO.getAllFilesOfType(sourceFolder, ".aseprite");
    }

    static async saveAsepriteFileAsPNG(sourceFolder, file, outputFolder)
    {
        console.log(`Saving ${file} as a .png file...`);

        const pngName = file.replace(".aseprite", ".png");
        await Commands.run(`aseprite -b ${path.join(sourceFolder, file)} --save-as ${path.join(outputFolder, pngName)}`);
    }

    static async saveAllAsepriteFilesInFolder(sourceFolder, outputFolder)
    {
        const files = await this.getAsepriteFiles(sourceFolder);
        for (let i = 0; i < files.length; i++)
        {
            await this.saveAsepriteFileAsPNG(sourceFolder, files[i], outputFolder);
        }
    }

    static async exportToTextureSheet(sourceFolder, outputFolder, textureName)
    {
        const imagesPath = path.join(outputFolder, `_images_${textureName}`);
        await this.saveAllAsepriteFilesInFolder(sourceFolder, imagesPath);
        const files = await IO.getAllFilesOfType(imagesPath, ".png");

        const imagesData = [];
        for (let i = 0; i < files.length; i++)
        {
            const pngFilePath = path.join(imagesPath, files[i]);
            imagesData.push({
                path: pngFilePath,
                contents: fs.readFileSync(pngFilePath)
            });
        }

        const textureOuputFolder = path.join(outputFolder, "textures");
        IO.ensureFolderExists(textureOuputFolder);

        const resultFiles = await packAsync(imagesData, {
            textureName,
            width: 1024,
            height: 1024,
            fixedSize: false,
            padding: 2,
            allowRotation: false,
            detectIdentical: true,
            allowTrim: true,
            exporter: "Phaser3",
            removeFileExtension: true,
            prependFolderName: true
        });

        const jsonOutput = resultFiles[0];
	    let jsonString = jsonOutput.buffer.toString();
	    jsonString = jsonString.replaceAll('./build_assets/', '');

        const imageOutput = resultFiles[1];

        await IO.writeFile(path.join(textureOuputFolder, jsonOutput.name), jsonString);
        await IO.writeFile(path.join(textureOuputFolder, imageOutput.name), imageOutput.buffer);

        console.log(`Exported sheet: ${jsonOutput.name}`);
    }

    static async exportAllFolders(sourceFolder, outputFolder)
    {
        const folders = await IO.getSubFolders(sourceFolder);
        for (let i = 0; i < folders.length; i++)
        {
            await this.exportToTextureSheet(path.join(sourceFolder, folders[i]), outputFolder, folders[i]);
        }
    }
}