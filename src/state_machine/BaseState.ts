export abstract class BaseState<T>
{
	public get machine(): T { return this._machine; }
	private _machine: T;

	public constructor(machine: T)
	{
		this._machine = machine;
	}

	public abstract enter(): void;
	public abstract exit(): void;
}