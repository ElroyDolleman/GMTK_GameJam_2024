import cmd from "node-cmd";
import { IO } from "./io.mjs"
import path from "path";

export class commands
{
	static run(command)
	{
		return new Promise((resolve, reject) =>
		{
			cmd.run(command, err =>
			{
				if (err) {
					reject(err);
				}
				else {
					resolve();
				}
			});
		});
	}

	static exportTiledMap(sourceFilePath, outputFilePath)
	{
		return this.run(`Tiled --export-map ${sourceFilePath} ${outputFilePath}`);
	}

	static exportTiledTileset(sourceFilePath, outputFilePath)
	{
		return this.run(`Tiled --export-tileset ${sourceFilePath} ${outputFilePath}`);
	}

	static async exportTiledTilesets(sourceFolder, outputFolder)
	{
		console.log("Exporting all tilesets");

		IO.ensureFolderExists(outputFolder);

		const files = await IO.getAllFilesOfType(sourceFolder, ".tsx");
		for (let i = 0; i < files.length; i++)
		{
			const outputFilePath = path.join(outputFolder, files[i].replace(".tsx", ".json"));

			console.log(`Export tileset: ${files[i]}`);
			await this.exportTiledTileset(path.join(sourceFolder, files[i]), outputFilePath);

			const fileContents = await IO.readFile(outputFilePath);
			const fileData = JSON.parse(fileContents);
			fileData.image = fileData.image.split("/").slice(-1)[0];

			await IO.writeFile(outputFilePath, JSON.stringify(fileData));
			await IO.copyFile(path.join(sourceFolder, fileData.image), outputFilePath)
		}
	}
}