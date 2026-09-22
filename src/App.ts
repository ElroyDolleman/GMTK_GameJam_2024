import { Game } from "phaser";
import { GameScene } from "./scenes/GameScene";
import { EndingScene } from "./scenes/EndingScene";
import { PreLevelScene } from "./scenes/PreLevelScene";
import { GameBoyUiScene } from "./scenes/GameBoyUiScene";

export const game = new Game({
	type: Phaser.AUTO,
	width: 320,
	height: 480,
	parent: "game-container",
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		width: 320,
		height: 480,
	},
	pixelArt: true,
	zoom: 2,
	backgroundColor: "#0x0",
	title: "GMTK Game Jam 2024",
	version: "0.1.3",
	disableContextMenu: true,
	scene: [ PreLevelScene, GameScene, EndingScene, GameBoyUiScene ],
	fps: {
        target: 60,
        min: 60,
    },
});