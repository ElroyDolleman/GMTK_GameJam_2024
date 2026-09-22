import { Game } from "phaser";
import { GameScene } from "./scenes/GameScene";
import { EndingScene } from "./scenes/EndingScene";
import { PreLevelScene } from "./scenes/PreLevelScene";
import { GameBoyUiScene } from "./scenes/GameBoyUiScene";

const APP_WIDTH = 320;
const APP_HEIGHT = 480;

function copyScreenshotToClipboard(source: CanvasImageSource): void
{
	if (!navigator.clipboard || typeof ClipboardItem === "undefined")
	{
		console.warn("Screenshot clipboard access is unavailable");
		return;
	}

	const screenshotCanvas = document.createElement("canvas");
	screenshotCanvas.width = APP_WIDTH;
	screenshotCanvas.height = APP_HEIGHT;
	screenshotCanvas.getContext("2d")?.drawImage(source, 0, 0, APP_WIDTH, APP_HEIGHT);

	const image = new Promise<Blob>((resolve, reject) =>
	{
		screenshotCanvas.toBlob((blob) =>
		{
			if (blob === null)
			{
				reject(new Error("Could not create screenshot"));
				return;
			}

			resolve(blob);
		}, "image/png");
	});

	void navigator.clipboard.write([new ClipboardItem({ "image/png": image })]).catch((error: unknown) =>
	{
		console.error("Could not copy screenshot to clipboard", error);
	});
}

export const game = new Game({
	type: Phaser.AUTO,
	width: APP_WIDTH,
	height: APP_HEIGHT,
	parent: "game-container",
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
		width: APP_WIDTH,
		height: APP_HEIGHT,
	},
	pixelArt: true,
	zoom: 2,
	backgroundColor: "#0x0",
	title: "GMTK Game Jam 2024",
	version: "0.2.0",
	disableContextMenu: true,
	scene: [ PreLevelScene, GameScene, EndingScene, GameBoyUiScene ],
	fps: {
        target: 60,
        min: 60,
    },
});

// Enables screenshots
window.addEventListener("keydown", (event: KeyboardEvent) =>
{
	if (event.key.toLowerCase() !== "p" || event.repeat)
	{
		return;
	}

	event.preventDefault();
	game.renderer.snapshotArea(0, 0, APP_WIDTH, APP_HEIGHT, (image) =>
	{
		if (image instanceof HTMLImageElement)
		{
			copyScreenshotToClipboard(image);
		}
	}, "image/png");
});