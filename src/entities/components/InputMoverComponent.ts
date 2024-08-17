import { GridEntity } from "../GridEntity";
import { IGridEntityComponent } from "./IGridEntityComponent";

export class InputMoverComponent implements IGridEntityComponent
{
    public get parent(): GridEntity
    {
        if (this._parent === undefined) { throw "Not attached to parent"; }
        return this._parent;
    }

    private _parent?: GridEntity;

    public constructor()
    {
    }

    public attachToParent(parent: GridEntity): void
    {
        this._parent = parent;
    }
}