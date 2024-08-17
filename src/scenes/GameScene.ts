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

		const player1 = new Player({
			scene: this,
			grid: level.getGrid(0),
			location: { x: 7, y: 7 }
		});
		level.addEntity(player1);
		const player2 = new Player({
			scene: this,
			grid: level.getGrid(0),
			location: { x: 8, y: 8 }
		});
		level.addEntity(player2);

		this._moveTest(level);
	}

	private async _moveTest(level: Level): Promise<void>
	{
		await level.inputMove({ x: 1, y: 0 }, 500);
		await level.inputMove({ x: 1, y: 0 }, 500);
		await level.inputMove({ x: 0, y: 1 }, 500);
		await level.inputMove({ x: 0, y: 1 }, 500);
		await level.inputMove({ x: 0, y: 1 }, 500);
		await level.inputMove({ x: 0, y: 1 }, 500);
		await level.inputMove({ x: 0, y: 1 }, 500);
		await level.inputMove({ x: 0, y: 1 }, 500);
		await level.inputMove({ x: 0, y: 1 }, 500);
		await level.inputMove({ x: 0, y: 1 }, 500);
		await level.inputMove({ x: -1, y: 0 }, 500);
		await level.inputMove({ x: 0, y: 1 }, 500);
		await level.inputMove({ x: 0, y: 1 }, 500);
	}
}