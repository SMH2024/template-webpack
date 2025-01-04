import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.add.image(512, 384, 'background');
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload() {
        // Set path for assets
        this.load.setPath('assets');

        // Load assets for the game
        this.load.image('logo', 'logo.png');
        this.load.image('background', 'background.png');

        // Load sprite frames (logsprite_0 to logsprite_44)
        for (let i = 0; i <= 44; i++) {
            this.load.image(`logsprite_${i}`, `logsprite_${i.toString().padStart(2, '0')}.png`);
        }
    }

    create() {
        // Create animations
        this.anims.create({
            key: 'block',
            frames: [
                { key: 'logsprite_0' },
                { key: 'logsprite_1' },
                { key: 'logsprite_2' },
                { key: 'logsprite_3' },
                { key: 'logsprite_4' }
            ],
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'dizzy',
            frames: [
                { key: 'logsprite_5' },
                { key: 'logsprite_6' },
                { key: 'logsprite_7' },
                { key: 'logsprite_8' },
                { key: 'logsprite_9' }
            ],
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: 'walk',
            frames: [
                { key: 'logsprite_10' },
                { key: 'logsprite_11' },
                { key: 'logsprite_12' },
                { key: 'logsprite_13' },
                { key: 'logsprite_14' }
            ],
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: 'hit',
            frames: [
                { key: 'logsprite_15' },
                { key: 'logsprite_16' },
                { key: 'logsprite_17' },
                { key: 'logsprite_18' },
                { key: 'logsprite_19' },
                { key: 'logsprite_20' },
                { key: 'logsprite_21' },
                { key: 'logsprite_22' },
                { key: 'logsprite_23' },
                { key: 'logsprite_24' }
            ],
            frameRate: 15,
            repeat: 0,
        });

        // Transition to MainMenu scene
        this.scene.start('MainMenu');
    }
}
