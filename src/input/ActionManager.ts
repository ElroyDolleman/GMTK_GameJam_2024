import { Input, Scene } from "phaser";
import { IPoint } from "../geometry/IPoint";
import { GridStep, Level } from "../level/Level";
import { GameEvent } from "../utils/GameEvent";
import { GameInput } from "./GameInput";
import { EntityTypes, GridEntity } from "../entities/GridEntity";
import { PlayerSpriteComponent } from "../entities/components/PlayerSpriteComponent";

export type Action =
{
    step: GridStep;
}

export type ActionManagerOptions = {
    level: Level;
    keyboard: Input.Keyboard.KeyboardPlugin;
}

export type EntityTypeChange =
{
    from: EntityTypes;
    to: EntityTypes;
}

export type EntityMove =
{
    from: IPoint;
    to: IPoint;
}

export type StepHistory =
{
    entity: GridEntity;
    typeChange?: EntityTypeChange;
    move?: EntityMove;
}

export class ActionStatistics
{
    public static amountOfAction: number = 0;
    public static amountOfUndos: number = 0;
}

export class ActionManager
{
    public disabled: boolean = false;

    public readonly onStep: GameEvent<number> = new GameEvent();

    public static instance: ActionManager;

    public get stepCount(): number { return this._actions.length; }
    public get noInputs(): boolean { return this.up.isUp && this.down.isUp && this.left.isUp && this.right.isUp; }

    public readonly history: Record<number, StepHistory[] | undefined> = {};

    public readonly onLevelReset: GameEvent<void> = new GameEvent();
    public readonly onNextLevel: GameEvent<void> = new GameEvent();

    public readonly level: Level;

    public readonly up: GameInput;
    public readonly left: GameInput;
    public readonly down: GameInput;
    public readonly right: GameInput;

    public readonly reset: GameInput;
    public readonly next: GameInput;
    public readonly undo: GameInput;

    private _actions: Action[] = [];
    private _actionDuration: number = 160;

    private _currentActionPromise?: Promise<boolean>;

    public constructor(options: ActionManagerOptions)
    {
        ActionManager.instance = this;

        this.level = options.level;

        this.up = new GameInput(options.keyboard.addKey("up"));
        this.left = new GameInput(options.keyboard.addKey("left"));
        this.down = new GameInput(options.keyboard.addKey("down"));
        this.right = new GameInput(options.keyboard.addKey("right"));

        this.reset = new GameInput(options.keyboard.addKey("r"));
        this.next = new GameInput(options.keyboard.addKey("n"));
        this.undo = new GameInput(options.keyboard.addKey("z"));

        this.level.onEntitiesMoved.addListener(this._onMoved, this);
    }

    public async stepBack(): Promise<boolean>
    {
        const step = this.stepCount - 1;
        if (step < 0)
        {
            return false;
        }
        const history = this.history[step] ?? [];
        const promises: Promise<unknown>[] = [];

        for (let i = history.length - 1; i >= 0; i--)
        {
            const data = history[i];
            if (data.move)
            {
                promises.push(this.level.moveEntity(
                    data.entity,
                    {
                        x: data.move.from.x - data.move.to.x,
                        y: data.move.from.y - data.move.to.y,
                    } as GridStep,
                    this._actionDuration,
                    false
                ));
            }
            if (data.typeChange)
            {
                if (data.typeChange.from === EntityTypes.Victory)
                {
                    const player = this.level.entities.find(e => e.isPlayer);
                    const compnent = player?.getComponent(PlayerSpriteComponent);
                    if (compnent)
                    {
                        // The cake is back :D
                        compnent.isSad = false;
                    }
                }
                data.entity.changeType(data.typeChange.from, false);
            }
        }

        this.history[step] = undefined;
        this._actions.length = step;

        await Promise.all(promises);
        // console.log("Step Back", step);

        ActionStatistics.amountOfUndos++;
        return true;
    }

    public update(): void
    {
        if (this.disabled)
        {
            return;
        }
        this.up.update();
        this.left.update();
        this.down.update();
        this.right.update();
        // this.next.update();
        this.reset.update();
        this.undo.update();

        if (this.reset.justDown)
        {
            this.onLevelReset.trigger();
            return;
        }
        if (this.next.justDown)
        {
            this.onNextLevel.trigger();
            return;
        }
        if (this.isPerformingAction())
        {
            return;
        }
        if (this.undo.isDown)
        {
            this._currentActionPromise = this.stepBack();
            this._currentActionPromise.then(() => this._currentActionPromise = undefined);
            return;
        }
        if (!this.noInputs)
        {
            const step = this._getStepFromInputs();
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
        this.history[this.stepCount] = [];

        await this.awaitCurrentAction();

        const hasMoved = await (this._currentActionPromise = this.level.inputMove(action.step, this._actionDuration));
        this._currentActionPromise = undefined;

        if (hasMoved)
        {
            this._actions.push(action);
            this.onStep.trigger(this.stepCount);

            ActionStatistics.amountOfAction++;
            // console.log("Step", this.stepCount);
        }
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