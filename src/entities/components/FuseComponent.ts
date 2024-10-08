import { GameObjects } from "phaser";
import { IPoint } from "../../geometry/IPoint";
import { EntityTypes, GridEntity } from "../GridEntity";
import { IGridEntityComponent } from "./IGridEntityComponent";
import { FadeObject } from "../../utils/FadeObject";
import { AudioManager } from "../../audio/AudioManager";
import { ActionManager } from "../../input/ActionManager";

export class FuseComponent implements IGridEntityComponent
{
    private _changedBack: number = -1;

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

    public onTypeChange(from: EntityTypes, to: EntityTypes, saveHistory: boolean): void
    {
        if (from === EntityTypes.Controllable && to === EntityTypes.Attachable)
        {
            this._changedBack = ActionManager.instance.stepCount;
        }
        if (saveHistory && from === EntityTypes.Attachable && to === EntityTypes.Controllable)
        {
            if (this._changedBack === ActionManager.instance.stepCount)
            {
                // We changed back and forth, no need to spam the feedback
                return;
            }

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