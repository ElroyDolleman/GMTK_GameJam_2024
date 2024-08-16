import { Scene } from "phaser";

export class GameScene extends Scene
{
	public static key = "GameScene";

	public constructor()
	{
		super({ key: GameScene.key });
		console.log("constructor");
	}

	public init(): void
	{
		console.log("init");
	}

	public preload(): void
	{
		console.log("preload");
	}

	public create(): void
	{
		console.log("create");
	}
}