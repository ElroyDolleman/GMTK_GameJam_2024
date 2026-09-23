export interface ITouchInputButton
{
	setActive(): void;
	setInactive(): void;
}

export class TouchInputButtonSprite implements ITouchInputButton
{
	public readonly sprite: Phaser.GameObjects.Sprite;

	private readonly _frameActiveName: string;
	private readonly _frameInactiveName: string;

	public constructor(sprite: Phaser.GameObjects.Sprite, frameActiveName: string, frameInactiveName: string)
	{
		this.sprite = sprite;
		this._frameActiveName = frameActiveName;
		this._frameInactiveName = frameInactiveName;
	}

	setActive(): void
	{
		this.sprite.setFrame(this._frameActiveName);
	}

	setInactive(): void
	{
		this.sprite.setFrame(this._frameInactiveName);
	}
}

export class TouchInputButtonGraphics implements ITouchInputButton
{
	public readonly graphics: Phaser.GameObjects.Graphics;

	private readonly _colorActive: number;
	private readonly _colorInactive: number;
	private readonly _x: number;
	private readonly _y: number;
	private readonly _width: number;
	private readonly _height: number;

	public constructor(
		graphics: Phaser.GameObjects.Graphics,
		colorActive: number,
		colorInactive: number,
		x: number,
		y: number,
		width: number,
		height: number
	)
	{
		this.graphics = graphics;
		this._colorActive = colorActive;
		this._colorInactive = colorInactive;
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;

		this.setInactive();
	}

	setActive(): void
	{
		this._setColor(this._colorActive);
	}

	setInactive(): void
	{
		this._setColor(this._colorInactive);
	}

	private _setColor(color: number): void
	{
		this.graphics.clear();
		this.graphics.fillStyle(color, 1);
		this.graphics.fillRect(this._x, this._y, this._width, this._height);
	}
}