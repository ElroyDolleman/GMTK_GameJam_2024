import { IPoint } from "../../geometry/IPoint";
import { ActionManager } from "../../input/ActionManager";
import { FadeObject } from "../../utils/FadeObject";
import { EntityTypes, GridEntity } from "../GridEntity";
import { IGridEntityComponent } from "./IGridEntityComponent";

export class PlayerSpriteComponent implements IGridEntityComponent
{
    public get isSad(): boolean { return this._isSad; }
    public set isSad(value: boolean)
    {
        this._isSad = value;

        if (!this._gotTheCake)
        {
            this.parent.sprite?.setFrame(value ? "player6" : "player1");
        }
    }
    private _isSad: boolean = false;

    private _gotTheCake: boolean = false;

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

    public onMoveStart(direction: IPoint, saveHistory: boolean): void
    {
        // Is false when we rewind
        const location = this.parent.gridLocation;
		const gridDestination = { x: location.x + direction.x, y: location.y + direction.y };
        const destCell = this.parent.grid.getCell(gridDestination.x, gridDestination.y);
        const cakes = destCell.entities.filter(e => e.type === EntityTypes.Victory);
        if (cakes.length > 0)
        {
            this.parent.sprite?.setFrame("player11");
            this._gotTheCake = true;

            cakes.forEach(cake => FadeObject(this.parent.scene, cake.sprite ?? { alpha: 1 }, 150, 0));
            return;
        }

        if (!saveHistory)
        {
            // Facing direction is in reverse when going back in time
            direction.x *= -1;
            direction.y *= -1;
        }

        let frameNum: number = 1;
        switch (true)
        {
            case direction.y > 0:
                frameNum = 5;
                break;
            case direction.y < 0:
                frameNum = 4;
                break;
            case direction.x > 0:
                frameNum = 3;
                break;
            case direction.x < 0:
                frameNum = 2;
                break;
        }
        if (this.isSad)
        {
            frameNum += 5;
        }
        this.parent.sprite?.setFrame("player" + frameNum);
    }

    public onMoveEnd(): void
    {
        if (!this._gotTheCake)
        {
            this.parent.sprite?.setFrame(this.isSad ? "player6" : "player1");
        }
    }
}