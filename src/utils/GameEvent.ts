type EventCallback<T> = (data: T) => void;

type EventSubscriber<T> = {
	callback: EventCallback<T>;
	scope: any;
	once: boolean;
}

export class GameEvent<T>
{
	private _subscribers: EventSubscriber<T>[] = [];

	public addListener(callback: EventCallback<T>, scope: any, once: boolean = false): EventCallback<T>
	{
		this._subscribers.push({ callback, scope, once });
		return callback;
	}

	public listenOnce(callback: EventCallback<T>, scope: any): EventCallback<T>
	{
		return this.addListener(callback, scope, true);
	}

	public removeListener(callback: EventCallback<T>, scope: any): void
	{
		const index = this._subscribers.findIndex(subscriber =>
		{
			return subscriber.callback === callback && subscriber.scope === scope;
		});

		if (index === -1)
		{
			console.warn("Tried to remove a listener that was not there", scope);
			return;
		}

		this._subscribers.splice(index, 1);
	}

	public removeAllListeners(): void
	{
		this._subscribers = [];
	}

	public trigger(data: T): void
	{
		for (let i = 0; i < this._subscribers.length; i++)
		{
			const element = this._subscribers[i];
			element.callback.call(element.scope, data);

			if (element.once)
			{
				this._subscribers.splice(i, 1);
				i--;
			}
		}
	}
}