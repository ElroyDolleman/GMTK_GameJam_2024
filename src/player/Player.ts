import { Scene } from "phaser";
import { EntityTypes, GridEntity } from "../entities/GridEntity";
import { IPoint } from "../geometry/IPoint";
import { Grid } from "../grid/Grid";

export type PlayerOptions = {
	location: IPoint;
    scene: Scene;
    grid: Grid<unknown>;
};

export class Player extends GridEntity
{
    public constructor(options: PlayerOptions)
    {
        super({
            hitbox: { x: 0, y: 0, width: 16, height: 16 },
            location: options.location,
            scene: options.scene,
            grid: options.grid,
            debug: true,
            type: EntityTypes.Controllable
        });
    }

    public update(): void
    {
    }
}