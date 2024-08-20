import { GameObjects } from "phaser";
import { IPoint } from "../../geometry/IPoint";
import { EntityTypes, GridEntity } from "../GridEntity";
import { IGridEntityComponent } from "./IGridEntityComponent";
import { FadeObject } from "../../utils/FadeObject";
import { AudioManager } from "../../audio/AudioManager";

export class FuseComponent implements IGridEntityComponent
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

    public onMoveStart(direction: IPoint, saveHistory: boolean): void
    {
    }

    public onMoveEnd(): void
    {
    }

    public onTypeChange(from: EntityTypes, to: EntityTypes): void
    {
        if (from === EntityTypes.Attachable && to === EntityTypes.Controllable)
        {
            AudioManager.playSound("fuse");

            if (this.parent.sprite)
            {
                const sprite = this.parent.sprite;
                const x = sprite.x;
                const y = sprite.y;

                const graphics = this.parent.scene.add.graphics({ fillStyle: { color: 0xFFFFFF, alpha: 0.5 } });
                graphics.fillRect(0, 0, 16, 16);
                FadeObject(this.parent.scene, graphics, 500, 0).then(() => graphics.destroy(true));

                graphics.setPosition(sprite.x, sprite.y);

                this.parent.scene.tweens.add({
                    targets: graphics,
                    props:
                    {
                        alpha: { value: 0, duration: 200 },
                    },
                    onUpdate: () =>
                    {
                        graphics.setPosition(sprite.x, sprite.y);
                    },
                    onComplete: () =>
                    {
                        graphics.destroy(true);
                    }
                });
            }
        }
    }
}