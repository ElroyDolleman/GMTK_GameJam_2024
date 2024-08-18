import { Loader, Cache, Types } from "phaser";
import { LayerData, LayerType, LevelData, ObjectData, ObjectLayerData, TileLayerData } from "./LevelData";
import { TileData, TilesetData, TileType } from "./TilesetData";
import { EntityTypes } from "../entities/GridEntity";

export type LevelLoaderOptions =
{
    load: Loader.LoaderPlugin;
    cache: Cache.CacheManager;
    levelName: string;
};

export class LevelDataLoader
{
    public static getLevelJsonPath(levelName: string): string
    {
        return `assets/levels/${levelName}.json`;
    }

    public static getTilesetJsonPath(tilesetName: string): string
    {
        return `assets/tilesets/${tilesetName}.json`;
    }

    public static preloadFilesForLevel(load: Loader.LoaderPlugin, levelName: string): void
    {
        load.json(levelName, this.getLevelJsonPath(levelName));
        load.on(`filecomplete-json-${levelName}`, (_key: any, _type: any, levelData: any) =>
        {
            const tilesets = levelData["tilesetNames"] ?? [];
            for (let i = 0; i < tilesets.length; i++)
            {
                load.json(tilesets[i], `assets/tilesets/${tilesets[i]}.json`);
                load.on(`filecomplete-json-${tilesets[i]}`, (_key: any, _type: any, tilesetData: any) =>
                {
                    const image: string | undefined = tilesetData["image"];
                    if (image)
                    {
                        load.spritesheet(
                            image.replace(".png", ""),
                            `assets/tilesets/${image}`,
                            {
                                frameWidth: tilesetData["tilewidth"] ?? 1,
                                frameHeight: tilesetData["tileheight"] ?? 1
                            }
                        );
                    }
                });
            }
        });
    }

    public static getLevelData(cache: Cache.CacheManager, levelName: string): LevelData
    {
        const jsonData = cache.json.get(levelName);
        if (jsonData === undefined)
        {
            throw `Failed to find level ${levelName} in cache`;
        }

        const tileWidth = jsonData["tilewidth"] ?? 0;
        const tileHeight = jsonData["tileheight"] ?? 0;
        const rows = jsonData["width"] ?? 0;
        const columns = jsonData["height"] ?? 0;

        const layersDataList = jsonData["layers"] ?? [];
        const layers: LayerData[] = [];
        const tilesetName = jsonData["tilesetNames"]?.[0] ?? "";

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
            tileset: this.getTilesetData(cache, tilesetName),
        };
    }

    public static getTilesetData(cache: Cache.CacheManager, name: string = "default_tileset"): TilesetData
    {
        const jsonData = cache.json.get(name);
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

    private static _getPropertyValue<T>(name: string, properties: any[]): T | undefined
    {
        const data = properties.find((element: any) => element["name"] === name);
        return data["value"] ?? undefined;
    }

    private static _getLayerData(layer: any): LayerData
    {
        switch (layer?.["type"])
        {
            case "tilelayer":
                return {
                    type: layer["type"] as LayerType,
                    name: layer["name"] ?? "",
                    id: layer["id"] ?? -1,
                    tiles: layer["data"] ?? [],
                } as TileLayerData;
            case "objectgroup":
                return {
                    type: layer["type"] as LayerType,
                    name: layer["name"] ?? "",
                    id: layer["id"] ?? -1,
                    objects: this._getObjects(layer),
                } as ObjectLayerData;
        }
        throw `Unsupported layer type ${layer?.["type"]}`;
    }

    private static _getObjects(layer: any): ObjectData[]
    {
        const objects = layer["objects"] ?? [];
        const result: ObjectData[] = [];

        for (let i = 0; i < objects.length; i++)
        {
            const name = objects[i]?.["name"] ?? "None";
            const type: EntityTypes = EntityTypes[name] as any ?? EntityTypes.None;

            if (type === EntityTypes.None)
            {
                console.warn("Entity without type added");
            }

            const position = { x: objects[i]?.["x"] ?? 0, y: objects[i]?.["y"] ?? 0 };

            const properties = objects[i]?.["properties"] ?? [];
            let spriteName: string = "";
            properties.forEach((prop: any) =>
            {
                if (prop["name"] === "sprite")
                {
                    spriteName = prop["value"] ?? "";
                }
            });

            // console.log("entity", name, type);
            result.push({ name, type, position, spriteName });
        }

        return result;
    }
}