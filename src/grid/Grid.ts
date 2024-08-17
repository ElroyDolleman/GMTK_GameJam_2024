import { IPoint } from "../geometry/IPoint";
import { IRectangle } from "../geometry/IRectangle";
import { ICircle } from "../geometry/ICircle";

export interface GridOptions<T>
{
	rows: number;
	columns: number;
	cellWidth: number;
	cellHeight: number;
	cells: T[];
}

export class Grid<T>
{
	private readonly _cells: T[];

	public readonly rows: number;
	public readonly columns: number;

	public readonly cellWidth: number;
	public readonly cellHeight: number;

	public constructor(options: GridOptions<T>)
	{
		this._cells = options.cells;

		this.rows = options.rows;
		this.columns = options.columns;

		this.cellWidth = options.cellWidth;
		this.cellHeight = options.cellHeight;
	}

	public getCell(cellX: number, cellY: number): T
	{
		return this.getCellByIndex(this.getIndexByLocation(cellX, cellY));
	}

	public getIndexByLocation(cellX: number, cellY: number): number
	{
		return cellX + (cellY * this.rows);
	}

	public getCellByIndex(index: number): T
	{
		return this._cells[index];
	}

	public getCellsInRectangle(rect: IRectangle, margin: number = 0): T[]
	{
		return this.getCellsFromTo(
			this.toGridLocation(rect.x - margin, rect.y - margin),
			this.toGridLocation(rect.x + rect.width + margin, rect.y + rect.height + margin)
		);
	}

	public getCellsInCircle(circle: ICircle): T[]
	{
		const cells: T[] = [];
		const { x: cx, y: cy, radius } = circle;

		const minX = Math.max(0, this.toCellX(cx - radius));
		const minY = Math.max(0, this.toCellY(cy - radius));

		const maxX = Math.min(this.rows - 1, this.toCellX(cx + radius));
		const maxY = Math.min(this.columns - 1, this.toCellY(cy + radius));

		for (let y = minY; y <= maxY; y++)
		{
			for (let x = minX; x <= maxX; x++)
			{
				const cell = this.getCell(x, y);
				if (!cell) { continue; }

				const { x: cellX, y: cellY } = this.toWorldPosition(x, y);
				const dist = Math.sqrt((cx - cellX) ** 2 + (cy - cellY) ** 2);
				if (dist <= radius)
				{
					cells.push(cell);
				}
			}
		}

		return cells;
	}

	public getCellsFromTo(from: IPoint, to: IPoint): T[]
	{
		const cells: T[] = [];
		for (let x = from.x; x <= to.x; x++)
		{
			for (let y = from.y; y <= to.y; y++)
			{
				const cell = this.getCell(x, y);
				if (cell)
				{
					cells.push(cell);
				}
			}
		}
		return cells;
	}

	public toCellX(xPos: number): number
	{
		return Math.floor(xPos / this.cellWidth);
	}

	public toCellY(yPos: number): number
	{
		return Math.floor(yPos / this.cellHeight);
	}

	public toGridLocation(x: number, y: number): IPoint
	{
		return {
			x: this.toCellX(x),
			y: this.toCellY(y),
		};
	}

	public toWorldX(cellX: number): number
	{
		return cellX * this.cellWidth;
	}

	public toWorldY(cellY: number): number
	{
		return cellY * this.cellHeight;
	}

	public toWorldPosition(cellX: number, cellY: number): IPoint
	{
		return {
			x: this.toWorldX(cellX),
			y: this.toWorldY(cellY)
		};
	}

	public forEachCell(callback: (value: T, index: number, array: T[]) => void): void
	{
		this._cells.forEach(callback);
	}
}