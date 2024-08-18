import { Input, Scene } from "phaser";
import { IPoint } from "../geometry/IPoint";
import { GridStep, Level } from "../level/Level";
import { GameEvent } from "../utils/GameEvent";
import { GameInput } from "./GameInput";

export type Action =
{
    step: GridStep;
}

export type ActionManagerOptions = {
    level: Level;
    keyboard: Input.Keyboard.KeyboardPlugin;
}

export class ActionManager
{
    public readonly onLevelReset: GameEvent<void> = new GameEvent();

    public readonly level: Level;

    public readonly up: GameInput;
    public readonly left: GameInput;
    public readonly down: GameInput;
    public readonly right: GameInput;

    public readonly reset: GameInput;

    private _actions: Action[] = [];
    private _actionDuration: number = 200;

    private _currentActionPromise?: Promise<void>;

    private get _noInputs(): boolean { return this.up.isUp && this.down.isUp && this.left.isUp && this.right.isUp; }

    public constructor(options: ActionManagerOptions)
    {
        this.level = options.level;

        this.up = new GameInput(options.keyboard.addKey("up"));
        this.left = new GameInput(options.keyboard.addKey("left"));
        this.down = new GameInput(options.keyboard.addKey("down"));
        this.right = new GameInput(options.keyboard.addKey("right"));

        this.reset = new GameInput(options.keyboard.addKey("r"));

        this.level.onEntitiesMoved.addListener(this._onMoved, this);
    }

    public update(): void
    {
        this.up.update();
        this.left.update();
        this.down.update();
        this.right.update();

        this.reset.update();

        if (this.reset.justDown)
        {
            this.onLevelReset.trigger();
            return;
        }
        if (this._noInputs)
        {
            return;
        }

        const step = this._getStepFromInputs();

        if (!this.isPerformingAction())
        {
            this.doAction({ step });
        }
    }

    public isPerformingAction(): boolean
    {
        return this._currentActionPromise !== undefined;
    }

    public async awaitCurrentAction(): Promise<void>
    {
        await this._currentActionPromise;
    }

    public async doAction(action: Action): Promise<void>
    {
        await this.awaitCurrentAction();

        this._currentActionPromise = this.level.inputMove(action.step, this._actionDuration);
        this._actions.push(action);

        await this.awaitCurrentAction();
        this._currentActionPromise = undefined;
    }

    private _onMoved(): void
    {
    }

    private _getStepFromInputs(): GridStep
    {
        const result: IPoint = { x: 0, y: 0 };

        if (this.up.isDown)
        {
            result.y--;
        }
        if (this.down.isDown)
        {
            result.y++;
        }
        if (this.left.isDown && result.y === 0)
        {
            result.x--;
        }
        if (this.right.isDown && result.y === 0)
        {
            result.x++;
        }
        return result as GridStep;
    }
}