import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Set background
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'background').setAlpha(0.5);

        // Add character sprite
        this.character = this.add.sprite(512, 384, 'logsprite_0').setScale(2);

        // Set default animation
        this.character.play('walk');

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            block: Phaser.Input.Keyboard.KeyCodes.SPACE,
            dizzy: Phaser.Input.Keyboard.KeyCodes.D,
            hit: Phaser.Input.Keyboard.KeyCodes.H,
        });

        // Display some placeholder text
        this.add.text(512, 384, 'Use arrow keys to move, SPACE to block,\nD for dizzy, and H to get hit.', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            align: 'center',
        }).setOrigin(0.5);

        // Example scene transition
        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });
    }

    update() {
        const character = this.character;

        // Movement controls
        if (this.cursors.left.isDown) {
            character.setFlipX(true);
            character.x -= 2;
            character.play('walk', true);
        } else if (this.cursors.right.isDown) {
            character.setFlipX(false);
            character.x += 2;
            character.play('walk', true);
        } else if (this.cursors.up.isDown) {
            character.y -= 2;
            character.play('walk', true);
        } else if (this.cursors.down.isDown) {
            character.y += 2;
            character.play('walk', true);
        } else {
            character.stop();
        }

        // Action controls
        if (Phaser.Input.Keyboard.JustDown(this.keys.block)) {
            character.play('block', true);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.dizzy)) {
            character.play('dizzy', true);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.hit)) {
            character.play('hit', true);
        }
    }
}
