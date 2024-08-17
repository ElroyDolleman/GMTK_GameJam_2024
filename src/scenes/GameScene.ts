import { Scene } from "phaser";
import { LevelDataLoader } from "../level/LevelDataLoader";
import { Level } from "../level/Level";

export class GameScene extends Scene
{
	public static key = "GameScene";

	public constructor()
	{
		super({
			key: GameScene.key,
			pack: {
				files: []
			}
		});
	}

	public init(): void
	{
		console.log("init");
	}

	public preload(): void
	{
		console.log("preload");

		LevelDataLoader.preloadFilesForLevel(this.load, "playground-level");
	}

	public create(): void
	{
		console.log("create");

		const levelData = LevelDataLoader.getLevelData(this.cache, "playground-level");
		const level = new Level(this, levelData);
	}
}