import { Scene } from "phaser";
import { LevelDataLoader } from "../level/LevelDataLoader";
import { Level } from "../level/Level";
import { Player } from "../player/Player";
import { ActionManager } from "../input/ActionManager";
import { PlayerExtender } from "../player/PlayerExtender";

export class GameScene extends Scene
{
	public static key = "GameScene";

	public actionManager!: ActionManager;

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

		this.load.atlas("main", "assets/textures/main.png", "assets/textures/main.json");
		LevelDataLoader.preloadFilesForLevel(this.load, "playground-level");
	}

	public create(): void
	{
		console.log("create");

		if (this.input.keyboard === null)
		{
			console.error("Keyboard disabled :C");
			return;
		}

		const levelData = LevelDataLoader.getLevelData(this.cache, "playground-level");
		const level = new Level(this, levelData);

		this.actionManager = new ActionManager({
			keyboard: this.input.keyboard,
			level
		});

		const player1 = new Player({
			scene: this,
			grid: level.getGrid(0),
			location: { x: 4, y: 7 }
		});
		level.addEntity(player1);
		const player2 = new PlayerExtender({
			scene: this,
			grid: level.getGrid(0),
			location: { x: 7, y: 9 }
		});
		level.addEntity(player2);
		const player3 = new PlayerExtender({
			scene: this,
			grid: level.getGrid(0),
			location: { x: 7, y: 6 }
		});
		level.addEntity(player3);
	}

	public update(time: number, delta: number): void
	{
		this.actionManager.update();
	}
}