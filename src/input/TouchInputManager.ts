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

const DPAD_CENTER_X = 100;
const DPAD_CENTER_Y = 80;
const DPAD_BUTTON_OFFSET = 2;
const DPAD_SCALE = 2;
const DPAD_TEXTURE = "main";
const DPAD_INACTIVE_FRAME = 1;
const DPAD_ACTIVE_FRAME = 2;
const DPAD_CENTER_ORIGIN = 0.5;
const DPAD_EDGE_ORIGIN = 0;
const DPAD_OUTER_ORIGIN = 1;
const DPAD_HIT_AREAS: Record<DpadCreationOptions["linkedInput"], number[]> = {
    up: [0, 0, 18, 0, 18, 20, 9, 24, 0, 20],
    down: [0, 4, 9, 0, 18, 4, 18, 24, 0, 24],
    left: [0, 0, 20, 0, 24, 9, 20, 18, 0, 18],
    right: [0, 9, 4, 0, 24, 0, 24, 18, 4, 18]
};

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

        container.add(this._createDpadButton({ linkedInput: "up", x: DPAD_CENTER_X, y: DPAD_CENTER_Y + DPAD_BUTTON_OFFSET, originX: DPAD_CENTER_ORIGIN, originY: DPAD_OUTER_ORIGIN }));
        container.add(this._createDpadButton({ linkedInput: "down", x: DPAD_CENTER_X, y: DPAD_CENTER_Y - DPAD_BUTTON_OFFSET, originX: DPAD_CENTER_ORIGIN, originY: DPAD_EDGE_ORIGIN }));
        container.add(this._createDpadButton({ linkedInput: "left", x: DPAD_CENTER_X + DPAD_BUTTON_OFFSET, y: DPAD_CENTER_Y, originX: DPAD_OUTER_ORIGIN, originY: DPAD_CENTER_ORIGIN }));
        container.add(this._createDpadButton({ linkedInput: "right", x: DPAD_CENTER_X - DPAD_BUTTON_OFFSET, y: DPAD_CENTER_Y, originX: DPAD_EDGE_ORIGIN, originY: DPAD_CENTER_ORIGIN }));
    }

    public update()
    {
        
    }

    private _createDpadButton(options: DpadCreationOptions): Phaser.GameObjects.Sprite
    {
        const frameName = `dpad-button-${options.linkedInput}`;
        const button = this._scene.add.sprite(options.x, options.y, DPAD_TEXTURE, `${frameName}${DPAD_INACTIVE_FRAME}`);
        button.setScale(DPAD_SCALE);
        button.setOrigin(options.originX, options.originY);
        button.setInteractive(
            this._createDpadHitArea(options.linkedInput),
            Phaser.Geom.Polygon.Contains
        );

        button.on("pointerover", (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown)
            {
                this._inputs[options.linkedInput].setVirtualDown(true);
                button.setFrame(`${frameName}${DPAD_ACTIVE_FRAME}`);
            }
        });
        button.on("pointerdown", () => {
            this._inputs[options.linkedInput].setVirtualDown(true);
            button.setFrame(`${frameName}${DPAD_ACTIVE_FRAME}`);
        });
        button.on("pointerup", () => {
            this._inputs[options.linkedInput].setVirtualDown(false);
            button.setFrame(`${frameName}${DPAD_INACTIVE_FRAME}`);
        });
        button.on("pointerout", () => {
            this._inputs[options.linkedInput].setVirtualDown(false);
            button.setFrame(`${frameName}${DPAD_INACTIVE_FRAME}`);
        });

        return button;
    }

    private _createDpadHitArea(direction: DpadCreationOptions["linkedInput"]): Phaser.Geom.Polygon
    {
        return new Phaser.Geom.Polygon(DPAD_HIT_AREAS[direction]);
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