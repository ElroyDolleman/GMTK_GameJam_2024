import { Game } from "phaser";
import { GameScene } from "./scenes/GameScene";

export const game = new Game({
	type: Phaser.AUTO,
	width: 320,
	height: 320,
	pixelArt: true,
	zoom: 2,
	backgroundColor: "#FFFFFF",
	title: "GMTK Game Jam 2024",
	version: "0.0.1",
	disableContextMenu: true,
	scene: [ GameScene ]
});