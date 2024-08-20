import { Scene } from "phaser";
import { LevelDataLoader } from "../level/LevelDataLoader";
import { Level } from "../level/Level";
import { ActionManager } from "../input/ActionManager";
import { ScreenTransition } from "./ScreenTransition";
import { CurrentLevelNumber, GetSpecialLevelData, LEVELS, NextLevel } from "../config/Levels";

export type GameSceneOptions = {
	levelNumber: number;
}

export class GameScene extends Scene
{
	public actionManager!: ActionManager;
	private _tutorialText?: Phaser.GameObjects.Text;

	private get _levelName(): string { return LEVELS[CurrentLevelNumber % LEVELS.length]; }

	private _level!: Level;

	private get _isTutorial(): boolean { return CurrentLevelNumber === 0; }

	private _screenTransition!: ScreenTransition;

	public constructor()
	{
		super({
			key: "GameScene",
			pack: {
				files: []
			}
		});
	}

	public init(): void
	{
		console.log("Level", CurrentLevelNumber, this._levelName);
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

		const spData = GetSpecialLevelData();
		const background = this.add.graphics({ fillStyle: { color: spData.bgColor } });
		background.fillRect(0, 0, 320, 320);

		this._screenTransition = new ScreenTransition(this);

		const levelData = LevelDataLoader.getLevelData(this.cache, this._levelName);
		this._level = new Level(this, levelData);

		this.actionManager = new ActionManager({
			keyboard: this.input.keyboard,
			level: this._level
		});
		this.actionManager.disabled = true;

		this._screenTransition.transitionIn().then(() => this.actionManager.disabled = false);

		this._level.onLevelWon.addListener(this._handleVictory, this);
		this.actionManager.onNextLevel.addListener(this._handleVictory, this);
		this.actionManager.onLevelReset.addListener(this._handleReset, this);

		if (this._isTutorial)
		{
			this._tutorialText = this.add.text(320 / 2, 240, "Use the arrow keys to move", { align: "center" });
			this._tutorialText.setOrigin(0.5, 0.5);

			const explainReset = (step: number): void =>
			{
				if (step >= 5)
				{
					const text = "\nStuck?\nPress Z to go back in time";
					this._tutorialText?.setText(`${text}\n\n`);
					this.actionManager.onStep.removeListener(explainReset, this);

					setTimeout(() =>
					{
						this._tutorialText?.setText(`${text}\n\nOr press R to reset the level`);
					}, 2000);
				}
			};
			this.actionManager.onStep.addListener(explainReset, this);
		}
	}

	public update(time: number, delta: number): void
	{
		this.actionManager.update();
		this._level.update();
	}

	private async _handleVictory(): Promise<void>
	{
		this._tutorialText = undefined;
		this.actionManager.disabled = true;

		await this._screenTransition.transitionOut();

		this._level.destroy();
		NextLevel();
		if (CurrentLevelNumber < LEVELS.length)
		{
			this.scene.switch("PreLevelScene");
			this.scene.stop(this);
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