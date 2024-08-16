import { TilesetData } from "./TilesetData";

export type LayerType = "tilelayer" | "objectgroup";

export type LayerData =
{
    type: LayerType;
    name: string;
    id: number;
}

export type TileLayerData =
{
    type: "tilelayer";
    tiles: [];
} & LayerData;

export type ObjectLayerData =
{
    type: "objectgroup";
    objects: any[];
}

export type LevelData =
{
    layers: LayerData[];
    tileWidth: number;
	tileHeight: number;
    rows: number;
    columns: number;
    tileset: TilesetData;
}