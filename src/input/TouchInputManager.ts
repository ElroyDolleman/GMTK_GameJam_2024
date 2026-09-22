import { Scene } from "phaser";
import { ActionManager } from "./ActionManager";
import { IInputs } from "./IInputs";
import { GameInput } from "./GameInput";

export class TouchInputManager
{
    private get _inputs(): IInputs
    {
        const actionManager = ActionManager.instance;
        if (actionManager)
        {
            return actionManager;
        }
        // Silly, I know uwu
        return {
            up: new GameInput(),
            left: new GameInput(),
            down: new GameInput(),
            right: new GameInput(),

            reset: new GameInput(),
            next: new GameInput(),
            undo: new GameInput()
        }
    }

    private readonly _scene: Scene;

    public constructor(scene: Scene, container: Phaser.GameObjects.Container)
    {
        this._scene = scene;

        container.add(this._createRectButton("up", 80, 20));
        container.add(this._createRectButton("down", 80, 100));
        container.add(this._createRectButton("left", 40, 60));
        container.add(this._createRectButton("right", 120, 60));
    }

    public update()
    {
        
    }

    private _createRectButton(linkedInput: string, x: number, y: number, width: number = 40, height: number = 40): Phaser.GameObjects.Graphics
    {
        const button = this._scene.add.graphics();
        button.fillStyle(0x0f380f, 1);
        button.fillRect(x, y, width, height);
        button.setInteractive(
            new Phaser.Geom.Rectangle(x, y, width, height),
            Phaser.Geom.Rectangle.Contains
        );

        // @ts-ignore
        button.on("pointerdown", () => (this._inputs[linkedInput] as GameInput)?.setVirtualDown(true));
        // @ts-ignore
        button.on("pointerup", () => (this._inputs[linkedInput] as GameInput)?.setVirtualDown(false));
        // @ts-ignore
        button.on("pointerupoutside", () => (this._inputs[linkedInput] as GameInput)?.setVirtualDown(false));

        return button;
    }
}