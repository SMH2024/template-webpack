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
        // Load all sprite frames (00_logsprite.png to 44_logsprite.png)
        for (let i = 0; i <= 44; i++) {
            const fileName = `${i.toString().padStart(2, '0')}00_logsprite.png`;
            this.load.image(fileName, `/assets/${fileName}`);
        }
    }

    create() {
        // Create animations for all actions
        this.anims.create({
            key: 'block',
            frames: [
                { key: '00_logsprite.png' },
                { key: '01_logsprite.png' },
                { key: '02_logsprite.png' },
                { key: '03_logsprite.png' },
                { key: '04_logsprite.png' },
            ],
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'dizzy',
            frames: [
                { key: '05_logsprite.png' },
                { key: '06_logsprite.png' },
                { key: '07_logsprite.png' },
                { key: '08_logsprite.png' },
                { key: '09_logsprite.png' },
            ],
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'walk',
            frames: [
                { key: '10_logsprite.png' },
                { key: '11_logsprite.png' },
                { key: '12_logsprite.png' },
                { key: '13_logsprite.png' },
                { key: '14_logsprite.png' },
            ],
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'hit',
            frames: [
                { key: '15_logsprite.png' },
                { key: '16_logsprite.png' },
                { key: '17_logsprite.png' },
                { key: '18_logsprite.png' },
                { key: '19_logsprite.png' },
                { key: '20_logsprite.png' },
                { key: '21_logsprite.png' },
                { key: '22_logsprite.png' },
                { key: '23_logsprite.png' },
                { key: '24_logsprite.png' },
            ],
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'idle',
            frames: [
                { key: '25_logsprite.png' },
                { key: '26_logsprite.png' },
                { key: '27_logsprite.png' },
                { key: '28_logsprite.png' },
                { key: '29_logsprite.png' },
            ],
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'getKnockedDown',
            frames: [
                { key: '30_logsprite.png' },
                { key: '31_logsprite.png' },
                { key: '32_logsprite.png' },
                { key: '33_logsprite.png' },
                { key: '34_logsprite.png' },
            ],
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'leftjab',
            frames: [
                { key: '35_logsprite.png' },
                { key: '36_logsprite.png' },
                { key: '37_logsprite.png' },
                { key: '38_logsprite.png' },
                { key: '39_logsprite.png' },
            ],
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'rightjab',
            frames: [
                { key: '40_logsprite.png' },
                { key: '41_logsprite.png' },
                { key: '42_logsprite.png' },
                { key: '43_logsprite.png' },
                { key: '44_logsprite.png' },
            ],
            frameRate: 10,
            repeat: 0,
        });

        console.log('Animations created:', this.anims.anims.entries);

        // Move to MainMenu scene
        this.scene.start('MainMenu');
    }
}