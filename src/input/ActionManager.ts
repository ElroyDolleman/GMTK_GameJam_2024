import { IPoint } from "../geometry/IPoint";
import { Level } from "../level/Level";

export type Action =
{
    moved: IPoint;
}

export type ActionManagerOptions = {
    level: Level;
}

export class ActionManager
{
    public readonly level: Level;

    private _actions: Action[] = [];

    private _actionDuration: number = 500;

    public constructor(options: ActionManagerOptions)
    {
        this.level = options.level;
    }

    public move(move: IPoint): void
    {
        this._actions.push({ moved: move });
    }
}