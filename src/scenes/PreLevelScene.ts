import { GameObjects, Geom, Scene } from "phaser";
import { CurrentLevelNumber, GetDisplayLevelName } from "../config/LevelsConfig";
import { FadeObject } from "../utils/FadeObject";
import { AudioManager } from "../audio/AudioManager";

export type GameSceneOptions = {
	levelNumber: number;
}

export class PreLevelScene extends Scene
{
    private _ticks: number = 0;

    private _text!: GameObjects.Text;

	public constructor()
	{
		super({
			key: "PreLevelScene",
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
        AudioManager.preload(this);
	}

	public create(): void
	{
        const background = this.add.graphics({ fillStyle: { color: 0x0, alpha: 1 } });
        background.fillRectShape(new Geom.Rectangle(0, 0, 320, 320));

        this._text = this.add.text(320 / 2, 320 / 2, `Level ${CurrentLevelNumber + 1}\n\n${GetDisplayLevelName()}`, { align: "center" });
        this._text.setOrigin(0.5, 0.5);
        this._text.alpha = 0;
        this._fadeText(1);

        AudioManager.createAllSounds(this);

        this._ticks = 0;

        if (CurrentLevelNumber === 0)
        {
            AudioManager.playMusic(this);
        }
	}

	public update(time: number, delta: number): void
	{
        this._ticks++;
        if (this._ticks >= 3 * 60)
        {
            // Hacky, I know
            this._ticks = -999999;
            this._fadeText(0).then(() =>
            {
                this.scene.switch("GameScene");
                this.scene.stop(this);
            });
        }
	}

    private _fadeText(to: number): Promise<void>
    {
        return FadeObject(this, this._text, 150, to);
    }
}