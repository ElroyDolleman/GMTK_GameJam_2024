import { GameObjects, Geom, Scene } from "phaser";
import { IPoint } from "../geometry/IPoint";
import { IRectangle } from "../geometry/IRectangle";
import { TimeUtils } from "../utils/TimeUtils";
import { Grid } from "../grid/Grid";
import { ISceneObject } from "./ISceneObject";

// @TODO: Somewhere else
const MOVE_DURATION = 500;

export type GridEntityOptions = {
	hitbox: IRectangle;
	location: IPoint;
	scene: Scene;
	grid: Grid<unknown>;
	debug?: boolean;
	depth?: number;
	sprite?: GameObjects.Sprite;
};

export class GridEntity implements ISceneObject
{
	public speed: Phaser.Math.Vector2;

	private _localHitbox: IRectangle;
	public get localHitbox(): Phaser.Geom.Rectangle
	{
		return new Geom.Rectangle(
			this._localHitbox.x,
			this._localHitbox.y,
			this._localHitbox.width,
			this._localHitbox.height
		);
	}

	public get hitbox(): Phaser.Geom.Rectangle
	{
		return new Geom.Rectangle(
			this.x + this._localHitbox.x,
			this.y + this._localHitbox.y,
			this._localHitbox.width,
			this._localHitbox.height
		);
	}

	public get nextHitbox(): Phaser.Geom.Rectangle
	{
		return new Geom.Rectangle(
			this.x + this._localHitbox.x + this.speed.x * TimeUtils.elapsedSeconds,
			this.y + this._localHitbox.y + this.speed.y * TimeUtils.elapsedSeconds,
			this._localHitbox.width,
			this._localHitbox.height
		);
	}

	public get worldPosition(): IPoint { return this._position; }
	public get gridLocation(): IPoint { return this.grid.toGridLocation(this._position.x, this._position.y); }

	public get x(): number { return this.worldPosition.x; }
	public get y(): number { return this.worldPosition.y; }

	public readonly scene: Scene;
	public readonly grid: Grid<unknown>;
	public readonly sprite?: GameObjects.Sprite;

	public readonly depth: number;

	protected _debugGraphics?: GameObjects.Graphics;

	private _position: IPoint;

	public constructor(options: GridEntityOptions)
	{
		this.scene = options.scene;
		this.grid = options.grid;

		this._position = this.grid.toWorldPosition(options.location.x, options.location.y);
		this._localHitbox = options.hitbox;
		this.depth = options.depth ?? 0;

		this.speed = new Phaser.Math.Vector2();

		if (options.debug)
		{
			this._debugGraphics = this.scene.add.graphics({ fillStyle: { color: 0x0000aa, alpha: 0.5 } });
			this._debugGraphics.depth = this.depth;
			this._updateDebugGraphics();
		}
	}

	public move(amount: IPoint): Promise<void>
	{
		const location = this.gridLocation;
		const destination = this.grid.toWorldPosition(location.x + amount.x, location.y + amount.y);

		return new Promise<void>(resolve =>
		{
			const tween = this.scene.tweens.add({
				targets: this._position,
				duration: MOVE_DURATION,
				props: {
					x: { value: destination.x },
					y: { value: destination.y }
				},
				onUpdate: () => this._onPositionUpdated(),
				onComplete: () => resolve()
			});
		});
	}

	protected _onPositionUpdated(): void
	{
		this.sprite?.setPosition(this._position.x, this._position.y);
		this._updateDebugGraphics();
	}

	protected _updateDebugGraphics(): void
	{
		if (!this._debugGraphics)
		{
			return;
		}
		this._debugGraphics.clear();
		this._debugGraphics.fillRectShape(this.hitbox);
	}
}