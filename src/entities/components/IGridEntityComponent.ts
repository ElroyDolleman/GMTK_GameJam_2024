import { Input } from "phaser";
import { GridEntity } from "../GridEntity";
import { IPoint } from "../../geometry/IPoint";

export interface IGridEntityComponent
{
    readonly parent: GridEntity;
    attachToParent(parent: GridEntity): void;

    onMoveStart(direction: IPoint, saveHistory: boolean): void
    onMoveEnd(): void;
    onLevelWon?(): void;
    onKill?(): Promise<void>;
}