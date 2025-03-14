import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load all 45 boxer images (00-44)
        for (let i = 0; i <= 44; i++) {
            const fileName = `${i.toString().padStart(2, '0')}_logsprite.png`;
            this.load.image(fileName, `assets/${fileName}`);
        }
    }

    create() {
        // Move to the Preloader scene after loading
        this.scene.start('Preloader');
    }
}
