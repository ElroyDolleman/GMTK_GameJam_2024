export const LEVELS = [
    "slice-of-life",

	"sticky-situation",
	"a-hole-lot-to-learn",
	"pushitive-learning",
	"slice-of-life",
	"face-the-cake",
	"out-of-the-box",
	"holesome",
	"stairway-to-cake",
	"delivery-service",
	"sweet-little-corner",
	"a-slice-rotation",
	"slice-with-care",
	"fitting-in",
	"dont-drop-the-cake",
	"supply-chain",
];

export let CurrentLevelNumber: number = 0;

export const NextLevel = (): void =>
{
    CurrentLevelNumber++;
};

export const GetDisplayLevelName = (): string =>
{
    const filename = LEVELS[CurrentLevelNumber % LEVELS.length];
    let words = filename.split("-");
    words = words.map(word =>
    {
        let newWord = word.charAt(0).toUpperCase() + word.slice(1);
        if (newWord === "Dont")
        {
            // Maybe I should've added a propery in Tiled for this ._.
            newWord = "Don't";
        }
        return newWord;
    });

    return words.join(" ");
};

export type SpecialLevelData =
{
    bgColor: number;
    cakeNum: number;
}

export const GetSpecialLevelData = (): SpecialLevelData =>
{
    return {
        bgColor: 0xeafcff,
        cakeNum: 2
    };
};