import { GameObjects } from "phaser";
import { GetSpecialLevelData } from "../../config/Levels";
import { IPoint } from "../../geometry/IPoint";
import { EntityTypes, GridEntity } from "../GridEntity";
import { IGridEntityComponent } from "./IGridEntityComponent";

export class CakeSpriteComponent implements IGridEntityComponent
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
        const data = GetSpecialLevelData();
        this._parent.sprite?.setFrame(`cake${data.cakeNum}`);

        const pos = this._parent.worldPosition;
        this.particles = this._parent.scene.add.particles(
            0,
            0,
            "main",
            {
                frame: { frames: [ "player1", "player2", "player3"], cycle: true },
                lifespan: 500,
                speed: { min: 150, max: 250 },
                scale: { start: 0.8, end: 0 },
                blendMode: "ADD",
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

    public onLevelWon(): void
    {
        const pos = this.parent.worldPosition;
        this.particles.explode(10, pos.x, pos.y);
    }
}