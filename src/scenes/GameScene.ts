import { Scene } from "phaser";
import { LevelDataLoader } from "../level/LevelLoader";

export class GameScene extends Scene
{
	public static key = "GameScene";

    private _levelLoader!: LevelDataLoader;

	public constructor()
	{
		super({ key: GameScene.key });
	}

	public init(): void
	{
		console.log("init");
	}

	public preload(): void
	{
		console.log("preload");

        this._levelLoader = new LevelDataLoader({
            cache: this.cache,
            load: this.load,
            levelName: "playground-level",
        });
	}

	public create(): void
	{
		console.log("create");

        const levelData = this._levelLoader.getLevelData();
	}
}