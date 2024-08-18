import { Scene } from "phaser";
import { LevelDataLoader } from "../level/LevelDataLoader";
import { Level } from "../level/Level";
import { ActionManager } from "../input/ActionManager";

const LEVELS = [
	// "playground-level",
	"so-close-so-far",
	"fitting-in",
	"cake-is-a-lie",
	"delivery-service",
	"wholesome",
	"three-pushes-with-twist",
];

export type GameSceneOptions = {
	levelNumber: number;
}

export class GameScene extends Scene
{
	public static key = "GameScene";

	public actionManager!: ActionManager;

	private _levelNumber: number = 0;
	private get _levelName(): string { return LEVELS[this._levelNumber % LEVELS.length]; }

	private _level!: Level;

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
		console.log("init", this._levelNumber);
	}

	public preload(): void
	{
		console.log("preload");

		this.load.atlas("main", "assets/textures/main.png", "assets/textures/main.json");
		LevelDataLoader.preloadFilesForLevel(this.load, this._levelName);
	}

	public create(): void
	{
		console.log("create");

		if (this.input.keyboard === null)
		{
			console.error("Keyboard disabled :C");
			return;
		}

		const levelData = LevelDataLoader.getLevelData(this.cache, this._levelName);
		this._level = new Level(this, levelData);

		this.actionManager = new ActionManager({
			keyboard: this.input.keyboard,
			level: this._level
		});

		this._level.onLevelWon.addListener(this._handleVictory, this);
		this.actionManager.onNextLevel.addListener(this._handleVictory, this);
		this.actionManager.onLevelReset.addListener(this._handleReset, this);
	}

	public update(time: number, delta: number): void
	{
		this.actionManager.update();
	}

	private _handleVictory(): void
	{
		this._level.destroy();
		this._levelNumber++;
		this.scene.restart();
	}

	private _handleReset(): void
	{
		this._level.destroy();
		this.scene.restart();
	}
}