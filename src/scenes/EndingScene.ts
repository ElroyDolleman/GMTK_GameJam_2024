import { Geom, Scene } from "phaser";

export type GameSceneOptions = {
	levelNumber: number;
}

export class EndingScene extends Scene
{
	public constructor()
	{
		super({
			key: "EndingScene",
			pack: {
				files: []
			}
		});
	}

	public init(): void
	{
	}

	public preload(): void
	{
	}

	public create(): void
	{
        const background = this.add.graphics({ fillStyle: { color: 0x0, alpha: 1 } });
        background.fillRectShape(new Geom.Rectangle(0, 0, 320, 320));

        const text = this.add.text(320 / 2, 320 / 2, "Thanks for playing :3", { align: "center" });
        text.setOrigin(0.5, 0.5);
	}

	public update(time: number, delta: number): void
	{
	}
}