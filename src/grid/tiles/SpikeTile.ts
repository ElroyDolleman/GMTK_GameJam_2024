import { Tile } from "./Tile";

export class SpikeTile extends Tile
{
    public readonly solid: boolean = true;
    public readonly damaging: boolean = true;
}