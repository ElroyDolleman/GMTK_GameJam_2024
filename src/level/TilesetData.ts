export type TileType = "empty" | "solid";

export type TileData = {
    type: TileType;
}

export type TilesetData = {
    image: string;
    tileWidth: number;
    tileHeight: number;
    tiles: Record<number, TileData>;
}