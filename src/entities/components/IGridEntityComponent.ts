import { Input } from "phaser";
import { GridEntity } from "../GridEntity";

export interface IGridEntityComponent
{
    readonly parent: GridEntity;
    attachToParent(parent: GridEntity): void;

    // onInput(key: Input.Keyboard.Key): void;
}