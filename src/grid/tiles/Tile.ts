import { GameObjects, Geom } from "phaser";
import { IRectangle } from "../../geometry/IRectangle";
import { IPoint } from "../../geometry/IPoint";
import { GridEntity } from "../../entities/GridEntity";
import { Level } from "../../level/Level";

export type TileLocation =
{
    row: number;
    column: number;
}

export type TileOptions =
{
    location: TileLocation;
    level: Level;
    hitbox?: IRectangle;
    sprite?: GameObjects.Sprite;
    animationFrames?: number[]
}

export abstract class Tile
{
    public readonly solid: boolean = false;
    public readonly damaging: boolean = false;
    public readonly hole: boolean = false;

    public readonly hitbox?: Geom.Rectangle;
    public readonly sprite?: GameObjects.Sprite;

    public readonly location: TileLocation;

    public readonly entities: GridEntity[] = [];

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
        this.location = options.location;

        if (options.animationFrames)
        {
            const frames = options.animationFrames;
            let current = 0;
            options.level.onAnimationTick.addListener(() =>
            {
                current++;
                this.sprite!.setFrame(frames[current % frames.length]);
            }, this);
        }
    }

    public removeEntity(entity: GridEntity): void
    {
        const index = this.entities.indexOf(entity);
		if (index !== -1)
		{
			this.entities.splice(index, 1);
		}
        else
        {
            console.error("Failed to remove entity from tile", this.location, entity.type);
        }
    }

    public addEntity(entity: GridEntity): void
    {
        this.entities.push(entity);
    }
}