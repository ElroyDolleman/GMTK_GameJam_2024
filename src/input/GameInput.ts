export class GameInput
{
	public get isUp(): boolean
	{
		return !this.isDown;
	}
	public get heldDownFrames(): number
	{
		return this._heldDownFrames;
	}
	public get isDown(): boolean
	{
		return this._heldDownFrames > 0;
	}
	public get justDown(): boolean
	{
		return this._heldDownFrames === 1;
	}
	public get justReleased(): boolean
	{
		return this._prevHeldDownFrames > 0 && this._heldDownFrames === 0;
	}

	private _key: Phaser.Input.Keyboard.Key;
	private _heldDownFrames: number = 0;
	private _prevHeldDownFrames: number = 0;

	public constructor(key: Phaser.Input.Keyboard.Key)
	{
		this._key = key;
	}

	public update(): void
	{
		this._prevHeldDownFrames = this._heldDownFrames;

		if (this._key.isDown)
		{
			this._heldDownFrames++;
		}
		else
		{
			this._heldDownFrames = 0;
		}
	}
}