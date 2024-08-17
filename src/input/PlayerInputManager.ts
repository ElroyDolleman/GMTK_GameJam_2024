import { Scene } from "phaser";
import { GameInput } from "./GameInput";

export class PlayerInputManager
{
	public readonly left: GameInput;
	public readonly right: GameInput;
	public readonly jump: GameInput;
	public readonly down: GameInput;

	public constructor(scene: Scene)
	{
        if (scene.input.keyboard === null)
        {
            throw "Phaser keyboard is null";
        }

		this.left = new GameInput(scene.input.keyboard.addKey("left"));
		this.right = new GameInput(scene.input.keyboard.addKey("right"));
		this.jump = new GameInput(scene.input.keyboard.addKey("up"));
		this.down = new GameInput(scene.input.keyboard.addKey("down"));
	}

	public update(): void
	{
		this.left.update();
		this.right.update();
		this.jump.update();
		this.down.update();
	}
}