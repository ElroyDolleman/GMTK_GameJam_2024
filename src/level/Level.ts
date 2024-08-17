import { GameObjects, Scene } from "phaser";
import { Grid } from "../grid/Grid";
import { Tile } from "../grid/tiles/Tile";
import { LayerData, LevelData, TileLayerData } from "./LevelData";
import { TileType } from "./TilesetData";
import { EmptyTile } from "../grid/tiles/EmptyTile";
import { EntityTypes, GridEntity } from "../entities/GridEntity";
import { IGridEntityComponent } from "../entities/components/IGridEntityComponent";
import { Constructor } from "../utils/ConstructorGeneric";
import { SolidTile } from "../grid/tiles/SolidTile";

export type GridStep =
{
    x: -1 | 0 | 1;
    y: -1 | 0 | 1;
}

export class Level
{
    public get cellWidth(): number { return this._levelData.tileWidth; }
    public get cellHeight(): number { return this._levelData.tileHeight; }

    public readonly scene: Scene;

    private _grids: Grid<Tile>[] = [];
    private _entities: GridEntity[] = [];

    private _levelData: LevelData;

    public constructor(scene: Scene, levelData: LevelData)
    {
        this.scene = scene;
        this._levelData = levelData;

        levelData.layers.forEach(layerData =>
        {
            switch (layerData.type)
            {
                case "tilelayer":
                    this._grids.push(this._createGrid(layerData as TileLayerData));
                    break;
            }
        });
    }

    public async inputMove(step: GridStep, duration: number): Promise<void>
    {
        const entities = this._entities.filter(e => e.reactsOnInput);

        if (!this.canEntitiesMove(entities, step))
        {
            return;
        }

        const promises: Promise<void>[] = [];
        for (let i = 0; i < entities.length; i++)
        {
            promises.push(this.moveEntity(entities[i], step, duration));
        }
        await Promise.all(promises);
    }

    public canEntitiesMove(entities: GridEntity[], step: GridStep): boolean
    {
        const extraEntities: GridEntity[] = [];
        for (let i = 0; i < entities.length; i++)
        {
            const entity = entities[i];
            const location = entity.gridLocation;

            if (!this.hasGridOnLayer(entity.depth))
            {
                continue;
            }
            const grid = this.getGrid(entity.depth);
            const tile = grid.getCell(location.x + step.x, location.y + step.y);
            if (tile.solid)
            {
                return false;
            }

            for (let j = 0; j < tile.entities.length; j++)
            {
                const entity = tile.entities[i];
                switch (entity.type)
                {
                    case EntityTypes.Blockable:
                        return false;
                    case EntityTypes.Pushable:
                        const moreEntities = [entity];
                        if (!this.canEntitiesMove(moreEntities, step))
                        {
                            return false;
                        }
                        extraEntities.push(...moreEntities);
                        break;
                }
            }
        }
        entities.push(...extraEntities);
        return true;
    }

    public async moveEntity(entity: GridEntity, step: GridStep, duration: number): Promise<void>
    {
        const grid = this.getGrid(entity.depth);
        const location = entity.gridLocation;

        const current = grid.getCell(location.x, location.y);
        const next = grid.getCell(location.x + step.x, location.y + step.y);

        await entity.move(step.x, step.y, duration);

        current.removeEntity(entity);
        next.addEntity(entity);
    }

    public getEntityComponents(type: Constructor<IGridEntityComponent>): IGridEntityComponent[]
    {
        const components: IGridEntityComponent[] = [];
        for (let i = 0; i < this._entities.length; i++)
        {
            components.push(...this._entities[i].getComponents(type));
        }
        return components;
    }

    public addEntity(entity: GridEntity): void
    {
        this._entities.push(entity);
        const grid = this.getGrid(entity.depth);
        const location = entity.gridLocation;
        const cell = grid.getCell(location.x, location.y);
        cell.addEntity(entity);
    }

    public getGrid(layer: number): Grid<Tile>
    {
        const grid = this._grids[layer];
        if (grid === undefined)
        {
            throw `No grid found at layer ${layer}`;
        }
        return grid;
    }

    public hasGridOnLayer(layer: number): boolean
    {
        return this._grids[layer] !== undefined;
    }

    private _createGrid(layerData: TileLayerData): Grid<Tile>
    {
        const cells: Tile[] = [];
        const layer: number = this._grids.length;

        for (let i = 0; i < layerData.tiles.length; i++)
        {
            const tileId = (layerData.tiles[i] ?? 0) - 1;
            const tileType = this._levelData.tileset.tiles[tileId]?.type ?? "empty";

            const tile = this._createTile(tileType, tileId, i, layer);
            cells.push(tile);
        }

        return new Grid<Tile>({
            columns: this._levelData.columns,
            rows: this._levelData.rows,
            cellWidth: this._levelData.tileWidth,
            cellHeight: this._levelData.tileHeight,
            cells
        });
    }

    private _createTile(tileType: TileType, tileId: number, tileIndex: number, layer: number): Tile
    {
        const gridX = tileIndex % this._levelData.rows;
        const gridY = Math.floor(tileIndex / this._levelData.columns);
        const position = {
            x: gridX * this._levelData.tileWidth,
            y: gridY * this._levelData.tileHeight
        };

        let sprite: GameObjects.Sprite | undefined;
        if (tileId >= 0)
        {
            sprite = this.scene.add.sprite(
                position.x,
                position.y,
                this._levelData.tileset.image,
                tileId
            );
            sprite.setOrigin(0, 0);
            sprite.depth = layer;
        }

        switch(tileType)
        {
            default:
            case "empty":
                return new EmptyTile({
                    location: { row: gridX, column: gridY },
                    sprite
                });
            case "solid":
                return new SolidTile({
                    location: { row: gridX, column: gridY },
                    sprite
                });
        }
    }
}