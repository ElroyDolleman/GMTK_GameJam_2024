const VOLUME_MAP: Record<string, number> = {
    "slime-sqaush1": 0.36,
    "slime-sqaush2": 0.5,
    "slime-sqaush3": 0.35,
    "falling": 0.32,
    "win": 0.32,
};

const RATE_MAP: Record<string, number> = {
    "falling": 2,
};

export class AudioManager
{
    public static sounds: Record<string, Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound> = {};
    public static readonly defaultConfig: any = {
        mute: false,
        volume: 1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: false,
        delay: 0
    };

    private constructor() {};

    public static preload(scene: Phaser.Scene): void
    {
        scene.load.audio("slime-sqaush1", "assets/audio/slime-sqaush1.wav");
        scene.load.audio("slime-sqaush2", "assets/audio/slime-sqaush2.wav");
        scene.load.audio("slime-sqaush3", "assets/audio/slime-sqaush3.wav");
        scene.load.audio("falling", "assets/audio/falling.wav");
        scene.load.audio("win", "assets/audio/win.wav");
        scene.load.audio("background-music", "assets/audio/background-music.ogg");
    }

    public static createAllSounds(scene: Phaser.Scene): void
    {
        this.sounds["slime-sqaush1"] = scene.sound.add("slime-sqaush1");
        this.sounds["slime-sqaush2"] = scene.sound.add("slime-sqaush2");
        this.sounds["slime-sqaush3"] = scene.sound.add("slime-sqaush3");
        this.sounds["falling"] = scene.sound.add("falling");
        this.sounds["win"] = scene.sound.add("win");
    }

    public static playRandomSound(keys: string[]): void
    {
        this.playSound(keys[Math.floor(Math.random() * keys.length)]);
    }

    public static playSound(key: string): void
    {
        const sound = this.sounds[key];
        if (sound === undefined)
        {
            console.error(`Sound ${key} does not exist.`);
            return;
        }
        sound.play({
            volume: VOLUME_MAP[key] ?? 1,
            rate: RATE_MAP[key]
        });
    }

    public static playMusic(scene: Phaser.Scene): void
    {
        if (!scene.sound.locked)
        {
            this.startMusic(scene);
        }
        else
    {
            scene.sound.once(Phaser.Sound.Events.UNLOCKED, () =>
            {
                this.startMusic(scene);
            });
        }
    }

    public static startMusic(scene: Phaser.Scene): void
    {
        const music = scene.sound.add("background-music", {
            mute: false,
            volume: 0.13,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        music.play();
    }
}