import { Scene } from "phaser";
import { EntityTypes, GridEntity } from "../entities/GridEntity";
import { IPoint } from "../geometry/IPoint";
import { Grid } from "../grid/Grid";

export type PlayerOptions = {
	location: IPoint;
    scene: Scene;
    grid: Grid<unknown>;
};

export class PlayerExtender extends GridEntity
{
    public constructor(options: PlayerOptions)
    {
        super({
            hitbox: { x: 0, y: 0, width: 16, height: 16 },
            location: options.location,
            scene: options.scene,
            grid: options.grid,
            debug: true,
            reactsOnInput: false,
            type: EntityTypes.Pushable
        });
    }

    public update(): void
    {
    }
}