import { GameObjects, Geom, Scene } from "phaser";

const AMOUNT_OF_RECTS = 8;
const DURATION = 1000;
const OFFSET = 40;

export class ScreenTransition
{
    public rects: GameObjects.Graphics[] = [];
    public scene: Scene;

    public constructor(scene: Scene)
    {
        this.scene = scene;

        for (let i = 0; i < AMOUNT_OF_RECTS; i++)
        {
            this.rects.push(this.createRect(i));
        }
    }

    public createRect(num: number): GameObjects.Graphics
    {
        const graphics = this.scene.add.graphics({fillStyle: { color: 0x0, alpha: 1 }});
        graphics.depth = 7;
        graphics.fillRectShape(new Geom.Rectangle(
            0,
            320 / AMOUNT_OF_RECTS * num,
            320,
            320 / AMOUNT_OF_RECTS
        ));

        return graphics;
    }

    public async transitionOut(): Promise<void>
    {
        const promises: Promise<void>[] = [];
        for (let i = 0; i < AMOUNT_OF_RECTS; i++)
        {
            promises.push(this._moveRect(i, -320, (i) * OFFSET, false));
        }
        await Promise.all(promises);
    }

    public async transitionIn(): Promise<void>
    {
        const promises: Promise<void>[] = [];
        for (let i = 0; i < AMOUNT_OF_RECTS; i++)
        {
            promises.push(this._moveRect(i, 0, (AMOUNT_OF_RECTS - i) * OFFSET, true));
        }
        await Promise.all(promises);
    }

    private _moveRect(num: number, from: number, delay: number, hideOnEnd: boolean): Promise<void>
    {
        const rect = this.rects[num];
        rect.x = from;
        rect.setVisible(true);
        return new Promise<void>(resolve =>
        {
            this.scene.tweens.add({
                targets: rect,
                props:
                {
                    x: { value: rect.x + 320, duration: DURATION, ease: Phaser.Math.Easing.Cubic.InOut, delay },
                },
                onComplete: () =>
                {
                    rect.setVisible(!hideOnEnd);
                    resolve();
                }
            });
        });
    }
}