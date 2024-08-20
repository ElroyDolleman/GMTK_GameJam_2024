export class TimeManager
{
    public static get elapsedMS(): number { return (this.frameCount / 60) * 1000; }

    public static frameCount: number = 0;

    public static update(): void
    {
        this.frameCount++;
    }
}