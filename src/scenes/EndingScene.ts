import { Geom, Scene } from "phaser";
import { ActionStatistics } from "../input/ActionManager";
import { TimeManager } from "../utils/TimeManager";

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

		const timeMS = TimeManager.elapsedMS;
		const minutes = Math.floor(timeMS / 60000);
		const seconds = Math.floor((timeMS % 60000) / 1000);
		const milliseconds = Math.round(timeMS % 1000);
		const timeText = `${minutes}m ${seconds}s ${milliseconds}ms`;

        const text = this.add.text(320 / 2, 320 / 2, `Thanks for playing :3\n\n\nMoves Done: ${ActionStatistics.amountOfAction.toLocaleString()}\n\n${timeText}`, { align: "center" });
        text.setOrigin(0.5, 0.5);
	}

	public update(time: number, delta: number): void
	{
	}
}