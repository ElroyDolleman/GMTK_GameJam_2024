import path from "path";
import fs from "fs";

export class IO
{
	static async getAllFilesOfType(directory, extension)
	{
		return (await this.getAllFilesInFolder(directory)).filter(file => { return file.includes(extension); });
	}

	static getAllFilesInFolder(directory)
	{
		return new Promise((resolve, reject) =>
		{
			fs.readdir(directory, (err, files) =>
			{
				if (err) {
					reject(err);
				}
				else {
					resolve(files);
				}
			});
		});
	}

	static getSubFolders(directory)
	{
		return new Promise((resolve, reject) =>
		{
			fs.readdir(directory, (err, files) =>
			{
				if (err) {
					reject(err);
				}
				else {
					resolve(files.filter(file => { return !file.includes("."); }));
				}
			});
		});
	}

	static readFile(filepath)
	{
		return new Promise((resolve, reject) =>
		{
			fs.readFile(filepath, "utf8", (err, data) =>
			{
				if (err) {
					reject(err);
				}
				else {
					resolve(data);
				}
			});
		});
	}

	static writeFile(filepath, data)
	{
		return new Promise(resolve => fs.writeFile(filepath, data, resolve));
	}

	static copyFile(source, destination)
	{
		return new Promise((resolve, reject) =>
		{
			fs.copyFile(source, destination, (err) =>
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

	static async copyAllFilesFromFolder(directory, destination)
	{
		console.log(`Copy folder ${directory} to ${destination}`);
		this.ensureFolderExists(destination);

		const files = await this.getAllFilesInFolder(directory);
		for (let i = 0; i < files.length; i++)
		{
			await IO.copyFile(path.join(directory, files[i]), path.join(destination, files[i]))
		}
	}

	static ensureFolderExists(folderPath)
	{
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true });
		}
	}

	static async cleanFolder(directory)
	{
		const files = await this.getAllFilesInFolder(directory);
		for (let i = 0; i < files.length; i++)
		{
			fs.unlinkSync(path.join(directory, files[i]));
		}
	}
}