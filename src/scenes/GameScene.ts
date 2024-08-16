import { Scene } from "phaser";

export class GameScene extends Scene
{
    public static key = "GameScene";

    public constructor()
    {
        super({ key: GameScene.key });
        console.log("constructor");
    }

    public init()
    {
        console.log("init");
    }

    public preload()
    {
        console.log("preload");
    }

    public create()
    {
        console.log("create");
    }
}