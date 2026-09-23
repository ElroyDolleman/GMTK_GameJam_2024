import { Scene } from "phaser";
import { ActionManager } from "./ActionManager";
import { IInputs } from "./IInputs";
import { GameInput } from "./GameInput";

type DpadCreationOptions = {
    linkedInput: keyof Pick<IInputs, "up" | "left" | "down" | "right">,
    x: number,
    y: number,
    originX: number,
    originY: number
}

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

        container.add(this._createRectButton("undo", 196, 60));
        container.add(this._createRectButton("reset", 242, 60));

        container.add(this._createDpadButton({ linkedInput: "up", x: 100, y: 82, originX: 0.5, originY: 1 }));
        container.add(this._createDpadButton({ linkedInput: "down", x: 100, y: 78, originX: 0.5, originY: 0 }));
        container.add(this._createDpadButton({ linkedInput: "left", x: 102, y: 80, originX: 1, originY: 0.5 }));
        container.add(this._createDpadButton({ linkedInput: "right", x: 98, y: 80, originX: 0, originY: 0.5 }));
    }

    public update()
    {
        
    }

    private _createDpadButton(options: DpadCreationOptions): Phaser.GameObjects.Sprite
    {
        const frameName = `dpad-button-${options.linkedInput}`;
        const button = this._scene.add.sprite(options.x, options.y, "main", `${frameName}1`);
        button.setScale(2);
        button.setOrigin(options.originX, options.originY);
        button.setInteractive(
            this._createDpadHitArea(options.linkedInput),
            Phaser.Geom.Polygon.Contains
        );

        button.on("pointerover", (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown)
            {
                this._inputs[options.linkedInput].setVirtualDown(true);
                button.setFrame(`${frameName}2`);
            }
        });
        button.on("pointerdown", () => {
            this._inputs[options.linkedInput].setVirtualDown(true);
            button.setFrame(`${frameName}2`);
        });
        button.on("pointerup", () => {
            this._inputs[options.linkedInput].setVirtualDown(false);
            button.setFrame(`${frameName}1`);
        });
        button.on("pointerout", () => {
            this._inputs[options.linkedInput].setVirtualDown(false);
            button.setFrame(`${frameName}1`);
        });

        return button;
    }

    private _createDpadHitArea(direction: DpadCreationOptions["linkedInput"]): Phaser.Geom.Polygon
    {
        const points: Record<DpadCreationOptions["linkedInput"], number[]> = {
            up: [0, 0, 18, 0, 18, 20, 9, 24, 0, 20],
            down: [0, 4, 9, 0, 18, 4, 18, 24, 0, 24],
            left: [0, 0, 20, 0, 24, 9, 20, 18, 0, 18],
            right: [0, 9, 4, 0, 24, 0, 24, 18, 4, 18]
        };

        return new Phaser.Geom.Polygon(points[direction]);
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