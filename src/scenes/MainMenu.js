import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.add.image(512, 384, 'background');

        this.add.image(512, 300, 'logo');

        this.add.text(512, 200, 'CAR CONTROL TEST', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Start button
        const startButton = this.add.rectangle(512, 460, 250, 60, 0x00aa00, 0.8)
            .setInteractive()
            .on('pointerover', () => startButton.fillColor = 0x00ff00)
            .on('pointerout', () => startButton.fillColor = 0x00aa00)
            .on('pointerdown', () => this.scene.start('Game'));
            
        this.add.text(512, 460, 'START TEST', {
            fontFamily: 'Arial Black', fontSize: 26, color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Instructions
        this.add.text(512, 540, 'Left/Right: Turn car gradually\nA: Accelerate\nZ: Brake/Reverse\nNow with realistic physics!', {
            fontFamily: 'Arial', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);
    }
}
