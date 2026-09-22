import { GameInput } from "./GameInput";

export interface IInputs
{
    readonly up: GameInput;
    readonly left: GameInput;
    readonly down: GameInput;
    readonly right: GameInput;

    readonly reset: GameInput;
    readonly next: GameInput;
    readonly undo: GameInput;
}