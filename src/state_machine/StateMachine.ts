import { BaseState } from "./BaseState";

type State<T> = BaseState<StateMachine<T>>;

export class StateMachine<T>
{
	public get target(): T { return this._target; }
	public get currentState(): State<T> { return this._currentState; }

	private _target: T;
	private _currentState: State<T>;
	private _states: { [key: string]: State<T>; } = {};

	public constructor(target: T)
	{
		this._target = target;
	}

	public addState(stateKey: string, state: State<T>): void
	{
		this._states[stateKey] = state;
	}

	public start(initialStateKey: string): void
	{
		this._enterState(initialStateKey);
	}

	public changeState(stateKey: string): void
	{
		this._currentState.exit();
		this._enterState(stateKey);
	}

	protected _enterState(stateKey: string): void
	{
		this._currentState = this._states[stateKey];
		if (!this._currentState)
		{
			throw `State "${stateKey}" does not exist`;
		}
		this._currentState.enter();
	}
}