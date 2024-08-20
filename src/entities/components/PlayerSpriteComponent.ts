import { IPoint } from "../../geometry/IPoint";
import { ActionManager } from "../../input/ActionManager";
import { FadeObject } from "../../utils/FadeObject";
import { EntityTypes, GridEntity } from "../GridEntity";
import { IGridEntityComponent } from "./IGridEntityComponent";

export class PlayerSpriteComponent implements IGridEntityComponent
{
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
        if (!saveHistory)
        {
            direction.x *= -1;
            direction.y *= -1;
        }

        const location = this.parent.gridLocation;
		const gridDestination = { x: location.x + direction.x, y: location.y + direction.y };
        const destCell = this.parent.grid.getCell(gridDestination.x, gridDestination.y);
        const cakes = destCell.entities.filter(e => e.type === EntityTypes.Victory);
        if (cakes.length > 0)
        {
            // @TODO: Animate eating
            this.parent.sprite?.setFrame("player11");
            this._gotTheCake = true;

            cakes.forEach(cake => FadeObject(this.parent.scene, cake.sprite ?? { alpha: 1 }, 150, 0));
            return;
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
        this.parent.sprite?.setFrame("player" + frameNum);
    }

    public onMoveEnd(): void
    {
        if (!this._gotTheCake)
        {
            this.parent.sprite?.setFrame("player1");
        }
    }
}