import { GameObjects } from "phaser";
import { GetSpecialLevelData } from "../../config/LevelsConfig";
import { IPoint } from "../../geometry/IPoint";
import { EntityTypes, GridEntity } from "../GridEntity";
import { IGridEntityComponent } from "./IGridEntityComponent";
import { FadeObject } from "../../utils/FadeObject";

export class SlicableComponent implements IGridEntityComponent
{
    public particles!: GameObjects.Particles.ParticleEmitter;

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

        this.particles = this._parent.scene.add.particles(
            0,
            0,
            "main",
            {
                frame: "attachable",
                lifespan: 500,
                speed: { min: 50, max: 75 },
                scale: { start: 0.8, end: 0 },
                emitting: false,
            }
        );
    }

    public onMoveStart(direction: IPoint, saveHistory: boolean): void
    {
    }

    public onMoveEnd(): void
    {
    }

    public async onKill(): Promise<void>
    {
        const pos = this.parent.worldPosition;
        this.particles.explode(10, pos.x + 8, pos.y + 8);

        if (!this.parent.sprite)
        {
            return;
        }

        await FadeObject(this.parent.scene, this.parent.sprite, 150, 0);
    }
}