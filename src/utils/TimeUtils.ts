export type MSMM = {
	minutes: number;
	seconds: number;
	milliseconds: number;
}

export class TimeUtils
{
	private constructor() { }

	public static readonly elapsedSeconds: number = 1 / 60;
	public static get elapsedMS(): number { return this.elapsedSeconds * 1000; }

	public static getTimeDifferenceMSMM(firstDate: Date, secondDate: Date): MSMM
	{
		let millisecondsDifference = Math.floor(this.getMillisecondsDifference(firstDate, secondDate));
		let secondsDifference = Math.floor(this.getSecondsDifference(firstDate, secondDate));
		const minutesDifference = Math.floor(this.getMinutesDifference(firstDate, secondDate));

		millisecondsDifference -= secondsDifference * 1000;
		secondsDifference -= minutesDifference * 60;

		return {
			minutes: minutesDifference,
			seconds: secondsDifference,
			milliseconds: millisecondsDifference
		};
	}
	public static getSecondsDifference(firstDate: Date, secondDate: Date): number
	{
		return (secondDate.getTime() / 1000) - (firstDate.getTime() / 1000);
	}
	public static getMillisecondsDifference(firstDate: Date, secondDate: Date): number
	{
		return secondDate.getTime() - firstDate.getTime();
	}
	public static getMinutesDifference(firstDate: Date, secondDate: Date): number
	{
		return this.getSecondsDifference(firstDate, secondDate) / 60;
	}
}