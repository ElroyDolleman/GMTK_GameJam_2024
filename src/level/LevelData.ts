import { EntityTypes } from "../entities/GridEntity";
import { IPoint } from "../geometry/IPoint";
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
    tiles: number[];
} & LayerData;

export type ObjectData =
{
    name: string;
    type: EntityTypes;
    position: IPoint;
}

export type ObjectLayerData =
{
    type: "objectgroup";
    objects: ObjectData[];
} & LayerData;

export type LevelData =
{
    layers: LayerData[];
    tileWidth: number;
	tileHeight: number;
    rows: number;
    columns: number;
    tileset: TilesetData;
}