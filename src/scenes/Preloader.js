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

    preload ()
    {
        //  Load the assets for the game
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        
        // Load isometric pixel tile
        this.load.image('iso-pixel', 'isometric/isometric_pixel_0215.png');
        
        // Load supercar direction spritesheets - each contains 12 animation frames
        this.load.spritesheet('car-north', 'isometric/cars/supercar/north.png', { 
            frameWidth: 100, 
            frameHeight: 100
        });
        this.load.spritesheet('car-northeast', 'isometric/cars/supercar/northeast.png', { 
            frameWidth: 100, 
            frameHeight: 100
        });
        this.load.spritesheet('car-east', 'isometric/cars/supercar/east.png', { 
            frameWidth: 100, 
            frameHeight: 100
        });
        this.load.spritesheet('car-southeast', 'isometric/cars/supercar/southeast.png', { 
            frameWidth: 100, 
            frameHeight: 100
        });
        this.load.spritesheet('car-south', 'isometric/cars/supercar/south.png', { 
            frameWidth: 100, 
            frameHeight: 100
        });
        this.load.spritesheet('car-southwest', 'isometric/cars/supercar/southwest.png', { 
            frameWidth: 100, 
            frameHeight: 100
        });
        this.load.spritesheet('car-west', 'isometric/cars/supercar/west.png', { 
            frameWidth: 100, 
            frameHeight: 100
        });
        this.load.spritesheet('car-northwest', 'isometric/cars/supercar/northwest.png', { 
            frameWidth: 100, 
            frameHeight: 100
        });
    }

    create ()
    {
        //  Move to the MainMenu
        this.scene.start('MainMenu');
    }
}