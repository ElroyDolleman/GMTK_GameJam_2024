import { Scene } from "phaser";
import { ActionManager } from "./ActionManager";
import { IInputs } from "./IInputs";
import { GameInput } from "./GameInput";

export class TouchInputManager
{
    private readonly _fallbackInputs: IInputs = {
        up: new GameInput(),
        left: new GameInput(),
        down: new GameInput(),
        right: new GameInput(),

        reset: new GameInput(),
        next: new GameInput(),
        undo: new GameInput()
    };

    private get _inputs(): IInputs
    {
        return ActionManager.instance ?? this._fallbackInputs;
    }

    private readonly _scene: Scene;

    public constructor(scene: Scene, container: Phaser.GameObjects.Container)
    {
        this._scene = scene;

        container.add(this._createRectButton("up", 80, 20));
        container.add(this._createRectButton("down", 80, 100));
        container.add(this._createRectButton("left", 40, 60));
        container.add(this._createRectButton("right", 120, 60));

        container.add(this._createRectButton("undo", 196, 60));
        container.add(this._createRectButton("reset", 242, 60));
    }

    public update()
    {
        
    }

    private _createRectButton(linkedInput: keyof IInputs, x: number, y: number, width: number = 40, height: number = 40): Phaser.GameObjects.Graphics
    {
        const button = this._scene.add.graphics();
        button.fillStyle(0x0f380f, 1);
        button.fillRect(x, y, width, height);
        button.setInteractive(
            new Phaser.Geom.Rectangle(x, y, width, height),
            Phaser.Geom.Rectangle.Contains
        );

        button.on("pointerdown", () => this._inputs[linkedInput].setVirtualDown(true));
        button.on("pointerup", () => this._inputs[linkedInput].setVirtualDown(false));
        button.on("pointerupoutside", () => this._inputs[linkedInput].setVirtualDown(false));

        return button;
    }
}