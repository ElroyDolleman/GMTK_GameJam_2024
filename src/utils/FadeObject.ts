import { Scene } from "phaser";

export const FadeObject = (scene: Scene, obj: { alpha: number; }, duration: number, toValue: number, fromValue?: number): Promise<void> =>
{
    if (fromValue !== undefined)
    {
        obj.alpha = fromValue;
    }
    return new Promise<void>(resolve =>
    {
        scene.tweens.add({
            targets: obj,
            props:
            {
                alpha: { value: toValue, duration },
            },
            onComplete: () =>
            {
                resolve();
            }
        });
    });
};