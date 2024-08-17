import { Scene } from "phaser";
import { LevelDataLoader } from "../level/LevelDataLoader";
import { Level } from "../level/Level";
import { Player } from "../player/Player";

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

		const player = new Player({
			scene: this,
			grid: level.getGrid(0),
			location: { x: 9, y: 9 }
		});
		level.addEntity(player);

		this._moveTest(player);
	}

	private async _moveTest(player: Player): Promise<void>
	{
		await player.move({ x: 1, y: 0 });
		await player.move({ x: 1, y: 0 });
		await player.move({ x: 0, y: 1 });
		await player.move({ x: 0, y: 2 });
	}
}