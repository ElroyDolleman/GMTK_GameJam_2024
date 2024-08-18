import { GameObjects, Geom, Scene } from "phaser";
import { IPoint } from "../geometry/IPoint";
import { IRectangle } from "../geometry/IRectangle";
import { TimeUtils } from "../utils/TimeUtils";
import { Grid } from "../grid/Grid";
import { ISceneObject } from "./ISceneObject";
import { IGridEntityComponent } from "./components/IGridEntityComponent";
import { IComponentManager } from "../utils/IComponentManager";
import { Constructor } from "../utils/ConstructorGeneric";

export enum EntityTypes
{
	None,
	Controllable,
	Blockable,
	Pushable,
	Attachable,
	Victory
}

export type GridEntityOptions = {
	hitbox: IRectangle;
	location: IPoint;
	scene: Scene;
	grid: Grid<unknown>;
	debug?: boolean;
	depth?: number;
	sprite?: GameObjects.Sprite;

	type: EntityTypes;
	isPlayer: boolean;
};

export class GridEntity implements ISceneObject, IComponentManager<IGridEntityComponent>
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

	public get type(): EntityTypes { return this._type; }

	public get isKillable(): boolean
	{
		return this._type === EntityTypes.Controllable || this._type === EntityTypes.Attachable || this._type === EntityTypes.Victory;
	}

	public get fallable(): boolean
	{
		// Hack: Controllable can also fall but has special logic and we exclude it here
		return this._type === EntityTypes.Victory || this._type === EntityTypes.Attachable || this._type === EntityTypes.Pushable;
	}

	public readonly scene: Scene;
	public readonly grid: Grid<unknown>;
	public readonly sprite?: GameObjects.Sprite;

	public readonly isPlayer: boolean;

	public readonly depth: number;

	protected _debugGraphics?: GameObjects.Graphics;

	private _position: IPoint;
	private _components: IGridEntityComponent[] = [];

	private _type: EntityTypes;

	public constructor(options: GridEntityOptions)
	{
		this.scene = options.scene;
		this.grid = options.grid;
		this.isPlayer = options.isPlayer;
		this._type = options.type;

		this._position = this.grid.toWorldPosition(options.location.x, options.location.y);
		this._localHitbox = options.hitbox;
		this.depth = options.depth ?? 0;

		this.speed = new Phaser.Math.Vector2();

		if (options.sprite)
		{
			this.sprite = options.sprite;
			this.sprite.setPosition(this._position.x, this._position.y);
		}

		if (options.debug)
		{
			this._debugGraphics = this.scene.add.graphics({ fillStyle: { color: 0x0000aa, alpha: 0.5 } });
			this._debugGraphics.depth = this.depth;
			this._updateDebugGraphics();
		}
	}

	public addComponent(component: IGridEntityComponent): void
	{
		component.attachToParent(this);
	}

	public getComponent<K extends IGridEntityComponent>(type: Constructor<K>): K | undefined
	{
		return this._components.find(component => component instanceof type) as K;
	}

	public getComponents<K extends IGridEntityComponent>(type: Constructor<K>): K[]
	{
		return this._components.filter(component => component instanceof type) as K[];
	}

	public removeComponents<K extends IGridEntityComponent>(type: Constructor<K>): void
	{
		const index = this._components.findIndex(component => component instanceof type);
		if (index !== -1)
		{
			this._components.splice(index, 1);
		}
	}

	public move(amountX: -1 | 0 | 1, amountY: -1 | 0 | 1, duration: number): Promise<void>
	{
		const location = this.gridLocation;
		const destination = this.grid.toWorldPosition(location.x + amountX, location.y + amountY);

		if (amountX !== 0 && amountY !== 0)
		{
			throw "Can't move diagonally >:c";
		}
		if (amountX === 0 && amountY === 0)
		{
			// We went absolutely no where :D
			return Promise.resolve();
		}

		return new Promise<void>(resolve =>
		{
			const tween = this.scene.tweens.add({
				targets: this._position,
				duration,
				props: {
					x: { value: destination.x },
					y: { value: destination.y }
				},
				onUpdate: () => this._onPositionUpdated(),
				onComplete: () => resolve()
			});
		});
	}

	public changeType(type: EntityTypes): void
	{
		this._type = type;
	}

	public kill(): void
	{
		this.sprite?.setVisible(false);
		this.changeType(EntityTypes.None);
	}

	public fall(): void
	{
		this.changeType(EntityTypes.None);

		if (!this.sprite)
		{
			return;
		}

		this.sprite.x += this.sprite.width / 2;
		this.sprite.y += this.sprite.height / 2;
		this.sprite.setOrigin(0.5, 0.5);

		const tween = this.scene.tweens.add({
			targets: this.sprite,
			duration: 500,
			props: {
				scale: 0,
			},
			onComplete: () => this.sprite?.setVisible(false)
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