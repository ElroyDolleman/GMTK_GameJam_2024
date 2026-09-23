import { Scene } from "phaser";
import { TouchInputManager } from "../input/TouchInputManager";

export class GamePadUiScene extends Scene
{
    private _touchInputs!: TouchInputManager;

    public constructor()
    {
        super("GamePadUiScene");
    }

    public preload(): void
    {
        this.load.atlas("main", "assets/textures/main.png", "assets/textures/main.json");
    }

    public create(): void
    {
        const container = this.add.container(0, 320);

        const panel = this.add.graphics();
        panel.fillStyle(0x9bbc0f, 1);
        panel.fillRect(0, 0, 320, 160);
        panel.lineStyle(2, 0x0f380f, 1);
        panel.strokeRect(4, 4, 312, 152);

        container.add(panel);

        this._touchInputs = new TouchInputManager(this, container);
    }

    public update(_time: number, _delta: number): void
    {
        
    }
}
