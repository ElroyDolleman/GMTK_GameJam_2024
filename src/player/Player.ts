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
    public override sprite!: Phaser.GameObjects.Sprite;

    public constructor(options: PlayerOptions)
    {
        super({
            hitbox: { x: 0, y: 0, width: 16, height: 16 },
            location: options.location,
            scene: options.scene,
            grid: options.grid,
            type: EntityTypes.Controllable,
            sprite: options.scene.add.sprite(0, 0, "main", "player")
        });
        this.sprite.setOrigin(0, 0);
    }

    public update(): void
    {
    }
}