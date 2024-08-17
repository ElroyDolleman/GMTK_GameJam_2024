export type TileType = "empty" | "solid" | "spike" | "pit";

export type TileData = {
    type: TileType;
}

export type TilesetData = {
    image: string;
    tileWidth: number;
    tileHeight: number;
    tiles: Record<number, TileData>;
}