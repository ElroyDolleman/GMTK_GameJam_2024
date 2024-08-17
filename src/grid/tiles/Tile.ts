import { GameObjects, Geom } from "phaser";
import { IRectangle } from "../../geometry/IRectangle";
import { IPoint } from "../../geometry/IPoint";

export type TileOptions =
{
    position: IPoint;
    hitbox?: IRectangle;
    sprite?: GameObjects.Sprite;
}

export abstract class Tile
{
    public readonly hitbox?: Geom.Rectangle;
    public readonly sprite?: GameObjects.Sprite;

    public readonly position: IPoint;

    public constructor(options: TileOptions)
    {
        if (options.hitbox)
        {
            this.hitbox = new Geom.Rectangle(
                options.hitbox.x,
                options.hitbox.y,
                options.hitbox.width,
                options.hitbox.height
            );
        }

        this.sprite = options.sprite;
        this.position = options.position;
    }
}