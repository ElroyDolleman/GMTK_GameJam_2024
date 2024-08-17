import { GameObjects, Scene } from "phaser";
import { Grid } from "../grid/Grid";
import { Tile } from "../grid/tiles/Tile";
import { LayerData, LevelData, TileLayerData } from "./LevelData";
import { TileType } from "./TilesetData";
import { EmptyTile } from "../grid/tiles/EmptyTile";
import { GridEntity } from "../entities/GridEntity";

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

    public addEntity(entity: GridEntity, layer: number = 0): void
    {
        this._entities.push(entity);
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

    private _createGrid(layerData: TileLayerData): Grid<Tile>
    {
        const cells: Tile[] = [];
        const layer: number = this._grids.length;

        for (let i = 0; i < layerData.tiles.length; i++)
        {
            const tileId = layerData.tiles[i] ?? 0;
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
        if (tileId > 0)
        {
            sprite = this.scene.add.sprite(
                position.x,
                position.y,
                this._levelData.tileset.image,
                tileId - 1
            );
            sprite.setOrigin(0, 0);
            sprite.depth = layer;
        }

        switch(tileType)
        {
            default:
            case "empty":
                return new EmptyTile({
                    location: { row: position.x, column: position.y },
                    sprite
                });
        }
    }
}