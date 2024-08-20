import { GameObjects, Geom, Scene } from "phaser";
import { IPoint } from "../geometry/IPoint";
import { IRectangle } from "../geometry/IRectangle";
import { TimeUtils } from "../utils/TimeUtils";
import { Grid } from "../grid/Grid";
import { ISceneObject } from "./ISceneObject";
import { IGridEntityComponent } from "./components/IGridEntityComponent";
import { IComponentManager } from "../utils/IComponentManager";
import { Constructor } from "../utils/ConstructorGeneric";
import { ActionManager } from "../input/ActionManager";
import { PlayerSpriteComponent } from "./components/PlayerSpriteComponent";
import { Tile } from "../grid/tiles/Tile";
import { CakeSpriteComponent } from "./components/CakeSpriteComponent";
import { SlicableComponent } from "./components/SlicableComponent";

export enum EntityTypes
{
	None,
	Controllable,
	Blockable,
	Pushable,
	Attachable,
	Victory,
	Falling,
	Killed
}

export type GridEntityOptions = {
	hitbox: IRectangle;
	location: IPoint;
	scene: Scene;
	grid: Grid<Tile>;
	debug?: boolean;
	depth?: number;
	sprite?: GameObjects.Sprite;

	type: EntityTypes;
	isPlayer: boolean;
};

export type TypeChange =
{
	step: number;
	type: EntityTypes;
}

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
	public readonly grid: Grid<Tile>;
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

		if (options.isPlayer)
		{
			this.addComponent(new PlayerSpriteComponent());
		}
		if (this._type === EntityTypes.Victory)
		{
			this.addComponent(new CakeSpriteComponent());
		}
		if (this.isKillable)
		{
			this.addComponent(new SlicableComponent());
		}
	}

	public addComponent(component: IGridEntityComponent): void
	{
		component.attachToParent(this);
		this._components.push(component);
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

	public handleLevelWon(): void
	{
		this._components.forEach(c => c.onLevelWon?.());
	}

	public move(amountX: number, amountY: number, duration: number, saveHistory: boolean = true): Promise<void>
	{
		const location = this.gridLocation;
		const gridDestination = { x: location.x + amountX, y: location.y + amountY };
		const destination = this.grid.toWorldPosition(gridDestination.x, gridDestination.y);

		if (amountX === 0 && amountY === 0)
		{
			// We went absolutely no where :D
			return Promise.resolve();
		}

		if (saveHistory)
		{
			const step = ActionManager.instance.stepCount;
			const history = ActionManager.instance.history[step];
			if (history === undefined)
			{
				console.error("Something went wrong with the step history", ActionManager.instance.history);
			}
			else
			{
				history.push({
					entity: this,
					move: {
						from: location,
						to: gridDestination
					}
				});
			}
		}

		this._components.forEach(c => c.onMoveStart({ x: amountX, y: amountY }, saveHistory));

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
				onComplete: () =>
				{
					resolve();
					this._components.forEach(c => c.onMoveEnd());
				}
			});
		});
	}

	public async changeType(type: EntityTypes, saveHistory: boolean = true): Promise<void>
	{
		if (saveHistory)
		{
			const step = ActionManager.instance.stepCount;
			const history = ActionManager.instance.history[step];
			if (history === undefined)
			{
				console.error("Something went wrong with the step history", ActionManager.instance.history);
			}
			else
			{
				history.push({
					entity: this,
					typeChange: {
						from: this._type,
						to: type
					}
				});
			}
		}

		if (type !== EntityTypes.Falling && type !== EntityTypes.Killed && this.sprite && !this.sprite.visible)
		{
			this.sprite.alpha = 1;
			this.sprite.setVisible(true);
		}

		switch (type)
		{
			case EntityTypes.Falling:
				await this._fall();
				break;
			case EntityTypes.Killed:
				// We cannot await it because the type change is expected earlier for some reason
				this._kill();
				break;
		}

		this._type = type;
	}

	protected async _kill(): Promise<void>
	{
		for (let i = 0; i < this._components.length; i++)
		{
			await this._components[i].onKill?.();
		}
		if (!this.sprite)
		{
			return;
		}
		if (this._type === EntityTypes.Killed)
		{
			this.sprite.setVisible(false);
		}
		this.sprite.alpha = 1;
	}

	protected _fall(): Promise<void>
	{
		return new Promise<void>(resolve =>
		{
			if (!this.sprite)
			{
				resolve();
				return;
			}
			const sprite = this.sprite;
			sprite.x += sprite.width / 2;
			sprite.y += sprite.height / 2;
			sprite.setOrigin(0.5, 0.5);

			const tween = this.scene.tweens.add({
				targets: sprite,
				duration: 500,
				ease: Phaser.Math.Easing.Sine.In,
				props: {
					scale: 0,
				},
				onComplete: () =>
				{
					sprite.setVisible(false);

					sprite.scale = 1;
					sprite.setOrigin(0, 0);
					sprite.x -= sprite.width / 2;
					sprite.y -= sprite.height / 2;

					resolve();
				}
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