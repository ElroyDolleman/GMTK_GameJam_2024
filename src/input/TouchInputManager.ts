import { Scene } from "phaser";
import { ActionManager } from "./ActionManager";
import { IInputs } from "./IInputs";
import { GameInput } from "./GameInput";
import { ITouchInputButton, TouchInputButtonGraphics, TouchInputButtonSprite } from "./TouchInputButton";

type DpadCreationOptions = {
    linkedInput: keyof Pick<IInputs, "up" | "left" | "down" | "right">,
    x: number,
    y: number,
    originX: number,
    originY: number
}

const DPAD_CENTER_X = 80;
const DPAD_CENTER_Y = 80;
const DPAD_BUTTON_OFFSET = 2;
const DPAD_SCALE = 2;
const DPAD_TEXTURE = "main";
const DPAD_INACTIVE_FRAME = 1;
const DPAD_ACTIVE_FRAME = 2;
const DPAD_CENTER_ORIGIN = 0.5;
const DPAD_EDGE_ORIGIN = 0;
const DPAD_OUTER_ORIGIN = 1;
const BUTTON_ACTIVE_COLOR = 0xA1EC61;
const BUTTON_INACTIVE_COLOR = 0x0f380f;
const DPAD_HIT_AREAS: Record<DpadCreationOptions["linkedInput"], number[]> = {
    up: [0, 0, 18, 0, 18, 20, 9, 24, 0, 20],
    down: [0, 4, 9, 0, 18, 4, 18, 24, 0, 24],
    left: [0, 0, 20, 0, 24, 9, 20, 18, 0, 18],
    right: [0, 9, 4, 0, 24, 0, 24, 18, 4, 18]
};

export class TouchInputManager
{
    // Silly empty inputs for when the ActionManager has no instance
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

    private readonly _buttons: Partial<Record<keyof IInputs, ITouchInputButton>> = {};

    public constructor(scene: Scene, container: Phaser.GameObjects.Container)
    {
        this._scene = scene;

        const undoButton = this._createRectButton("undo", 196, 60);
        this._buttons.undo = undoButton;
        container.add(undoButton.graphics);

        const resetButton = this._createRectButton("reset", 242, 60);
        this._buttons.reset = resetButton;
        container.add(resetButton.graphics);

        this._addDpadButton(container, { linkedInput: "up", x: DPAD_CENTER_X, y: DPAD_CENTER_Y + DPAD_BUTTON_OFFSET, originX: DPAD_CENTER_ORIGIN, originY: DPAD_OUTER_ORIGIN });
        this._addDpadButton(container, { linkedInput: "down", x: DPAD_CENTER_X, y: DPAD_CENTER_Y - DPAD_BUTTON_OFFSET, originX: DPAD_CENTER_ORIGIN, originY: DPAD_EDGE_ORIGIN });
        this._addDpadButton(container, { linkedInput: "left", x: DPAD_CENTER_X + DPAD_BUTTON_OFFSET, y: DPAD_CENTER_Y, originX: DPAD_OUTER_ORIGIN, originY: DPAD_CENTER_ORIGIN });
        this._addDpadButton(container, { linkedInput: "right", x: DPAD_CENTER_X - DPAD_BUTTON_OFFSET, y: DPAD_CENTER_Y, originX: DPAD_EDGE_ORIGIN, originY: DPAD_CENTER_ORIGIN });
    }

    public update()
    {
        for (const key of Object.keys(this._buttons) as (keyof IInputs)[]) {
            const button = this._buttons[key];
            if (!button) {
                continue;
            }
            if (this._inputs[key].isDown) {
                button.setActive();
            }
            else {
                button.setInactive();
            }
        }
    }

    private _addDpadButton(container: Phaser.GameObjects.Container, options: DpadCreationOptions): void
    {
        const frameName = `dpad-button-${options.linkedInput}`;
        const sprite = this._scene.add.sprite(options.x, options.y, DPAD_TEXTURE, `${frameName}${DPAD_INACTIVE_FRAME}`);

        sprite.setScale(DPAD_SCALE);
        sprite.setOrigin(options.originX, options.originY);
        sprite.setInteractive(
            this._createDpadHitArea(options.linkedInput),
            Phaser.Geom.Polygon.Contains
        );

        const button = new TouchInputButtonSprite(
            sprite,
            `${frameName}${DPAD_ACTIVE_FRAME}`,
            `${frameName}${DPAD_INACTIVE_FRAME}`
        );
        this._buttons[options.linkedInput] = button;

        sprite.on("pointerover", (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown)
            {
                this._inputs[options.linkedInput].setVirtualDown(true);
            }
        });
        sprite.on("pointerdown", () => {
            this._inputs[options.linkedInput].setVirtualDown(true);
        });
        sprite.on("pointerup", () => {
            this._inputs[options.linkedInput].setVirtualDown(false);
        });
        sprite.on("pointerout", () => {
            this._inputs[options.linkedInput].setVirtualDown(false);
        });

        container.add(sprite);
    }

    private _createDpadHitArea(direction: DpadCreationOptions["linkedInput"]): Phaser.Geom.Polygon
    {
        return new Phaser.Geom.Polygon(DPAD_HIT_AREAS[direction]);
    }

    private _createRectButton(linkedInput: keyof IInputs, x: number, y: number, width: number = 40, height: number = 40): TouchInputButtonGraphics
    {
        const graphics = this._scene.add.graphics();
        const button = new TouchInputButtonGraphics(
            graphics,
            BUTTON_ACTIVE_COLOR,
            BUTTON_INACTIVE_COLOR,
            x,
            y,
            width,
            height
        );
        graphics.setInteractive(
            new Phaser.Geom.Rectangle(x, y, width, height),
            Phaser.Geom.Rectangle.Contains
        );

        graphics.on("pointerdown", () => {
            this._inputs[linkedInput].setVirtualDown(true);
        });
        graphics.on("pointerup", () => {
            this._inputs[linkedInput].setVirtualDown(false);
        });
        graphics.on("pointerout", () => {
            this._inputs[linkedInput].setVirtualDown(false);
        });

        return button;
    }
}