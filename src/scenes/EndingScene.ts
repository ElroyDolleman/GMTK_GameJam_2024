import { Geom, Scene } from "phaser";
import { LevelDataLoader } from "../level/LevelDataLoader";
import { Level } from "../level/Level";
import { ActionManager } from "../input/ActionManager";

const LEVELS = [
	// "playground-level",
	"tutorial",
	"a-hole-lot-to-learn",
	"pushitive-learning",
	"slice-of-life",
	"cake-is-a-lie",
	"three-pushes-with-twist",
	"wholesome",
	"stairway-to-cake",
	"delivery-service",
	"so-close-so-far",
	"a-slice-rotation",
	"fitting-in",
	"small-alley",
];

export type GameSceneOptions = {
	levelNumber: number;
}

export class EndingScene extends Scene
{
	public static key = "EndingScene";

	public constructor()
	{
		super({
			key: EndingScene.key,
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