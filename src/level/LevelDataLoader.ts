import { Loader, Cache } from "phaser";
import { LayerData, LayerType, LevelData } from "./LevelData";
import { TileData, TilesetData, TileType } from "./TilesetData";

export type LevelLoaderOptions =
{
    load: Loader.LoaderPlugin;
    cache: Cache.CacheManager;
    levelName: string;
};

export class LevelDataLoader
{
    private _load: Loader.LoaderPlugin;
    private _cache: Cache.CacheManager;
    private _levelName: string;

    public constructor(options: LevelLoaderOptions)
    {
        this._load = options.load;
        this._cache = options.cache;
        this._levelName = options.levelName;

        this._load.json(this._levelName, "assets/levels/" + this._levelName + ".json");

        // TODO: Add support for different tilesets
        this._load.json("default_tileset", "assets/tilesets/default_tileset.json");
    }

    public getLevelData(): LevelData
    {
        const jsonData = this._cache.json.get(this._levelName);
        if (jsonData === undefined)
        {
            throw `Failed to find level ${this._levelName}`;
        }

        const tileWidth = jsonData["tilewidth"] ?? 0;
        const tileHeight = jsonData["tileheight"] ?? 0;
        const rows = jsonData["width"] ?? 0;
        const columns = jsonData["height"] ?? 0;

        const layersDataList = jsonData["layers"] ?? [];
        const layers: LayerData[] = [];

        for (let i = 0; i < layersDataList.length; i++)
        {
            layers.push(this._getLayerData(layersDataList[i]));
        }

        return {
            layers,
            tileWidth,
            tileHeight,
            rows,
            columns,
            tileset: this.getTilesetData(),
        };
    }

    public getTilesetData(name: string = "default_tileset"): TilesetData
    {
        const jsonData = this._cache.json.get(name);
        if (jsonData === undefined)
        {
            throw `Failed to find tileset ${name}`;
        }

        const tileWidth = jsonData["tilewidth"] ?? 0;
        const tileHeight = jsonData["tileheight"] ?? 0;
        const tilesDataList = jsonData["tiles"] ?? [];
        const tiles: Record<number, TileData> = {};

        for (let i = 0; i < tilesDataList.length; i++)
        {
            const id: number = tilesDataList[i]?.["id"] ?? -1;
            const tileType: TileType = this._getPropertyValue("type", (tilesDataList[i]?.["properties"] ?? [] as any[])) ?? "empty";
            tiles[id] = { type: tileType };
        }

        return {
            image: name,
            tileWidth,
            tileHeight,
            tiles
        };
    }

    private _getPropertyValue<T>(name: string, properties: any[]): T | undefined
    {
        const data = properties.find((element: any) => element["name"] === name);
        return data["value"] ?? undefined;
    }

    private _getLayerData(layer: any): LayerData
    {
        switch (layer?.["type"])
        {
            case "tilelayer":
            case "objectgroup":
                return {
                    type: layer["type"] as LayerType,
                    name: layer["name"] ?? "",
                    id: layer["id"] ?? -1,
                };
        }
        throw `Unsupported layer type ${layer?.["type"]}`;
    }
}