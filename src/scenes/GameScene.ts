import { Scene } from "phaser";
import { LevelDataLoader } from "../level/LevelDataLoader";
import { Level } from "../level/Level";
import { ActionManager } from "../input/ActionManager";

const LEVELS = [
	"sticky-situation",
	"a-hole-lot-to-learn",
	"pushitive-learning",
	"slice-of-life",
	"cake-is-a-lie",
	"out-of-the-box",
	"holesome",
	"hole-slicing",
	"stairway-to-cake",
	"delivery-service",
	"sweet-little-corner",
	"a-slice-rotation",
	"fitting-in",
	"dont-drop-the-cake",
	"supply-chain",
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

	private get _isTutorial(): boolean { return this._levelNumber === 0; }

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
		console.log("Level", this._levelNumber, this._levelName);
	}

	public preload(): void
	{
		this.load.atlas("main", "assets/textures/main.png", "assets/textures/main.json");
		LevelDataLoader.preloadFilesForLevel(this.load, this._levelName);
	}

	public create(): void
	{
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

		if (this._isTutorial)
		{
			const tutorialText = this.add.text(320 / 2, 240, "Use the arrow keys to move", { align: "center" });
			tutorialText.setOrigin(0.5, 0.5);

			const explainReset = (step: number): void =>
			{
				if (step >= 5)
				{
					const text = "\nStuck?\nPress Z to go back in time";
					tutorialText.setText(`${text}\n\n`);
					this.actionManager.onStep.removeListener(explainReset, this);

					setTimeout(() =>
					{
						tutorialText?.setText(`${text}\n\nOr press R to reset the level`);
					}, 2000);
				}
			};
			this.actionManager.onStep.addListener(explainReset, this);
		}
	}

	public update(time: number, delta: number): void
	{
		this.actionManager.update();
	}

	private _handleVictory(): void
	{
		this._level.destroy();
		this._levelNumber++;
		if (this._levelNumber < LEVELS.length)
		{
			this.scene.restart();
		}
		else
		{
			this.scene.switch("EndingScene");
		}
	}

	private _handleReset(): void
	{
		this._level.destroy();
		this.scene.restart();
	}
}