import { Scene } from "phaser";
import { TouchInputManager } from "../input/TouchInputManager";

export class GamePadUiScene extends Scene
{
    private _touchInputs!: TouchInputManager;
    private _panelContainer!: Phaser.GameObjects.Container;

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
        this._panelContainer = this.add.container();

        const panel = this.add.graphics();
        panel.fillStyle(0x9bbc0f, 1);
        panel.fillRect(0, 0, 320, 160);
        panel.lineStyle(2, 0x0f380f, 1);
        panel.strokeRect(4, 4, 312, 152);

        this._panelContainer.add(panel);

        this._touchInputs = new TouchInputManager(this, this._panelContainer);
        this._positionPanel();
        this.scale.on(Phaser.Scale.Events.RESIZE, this._positionPanel, this);
    }

    public update(_time: number, _delta: number): void
    {
        this._touchInputs.update();
    }

    private _positionPanel(): void
    {
        this._panelContainer.setY(Math.max(320, this.scale.gameSize.height) - 160);
    }
}
