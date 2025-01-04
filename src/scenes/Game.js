import { Scene } from 'phaser';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        // Load assets here...
    }

    create() {
        // Set up keyboard input
        this.cursors = this.input.keyboard.createCursorKeys(); // Arrow keys for movement
        this.keys = this.input.keyboard.addKeys({
            attack: Phaser.Input.Keyboard.KeyCodes.SPACE, // Spacebar for attack
            leftjab: Phaser.Input.Keyboard.KeyCodes.A,    // A for left jab
            rightjab: Phaser.Input.Keyboard.KeyCodes.D,   // D for right jab
            block: Phaser.Input.Keyboard.KeyCodes.S,      // S for block
        });

        // Example sprite
        this.character = this.add.sprite(400, 300, 'characterKey'); // Replace with your sprite key
        this.character.setScale(2);

        // Play idle animation initially
        this.character.play('idle');
    }

    update() {
        // Movement logic with arrow keys
        if (this.cursors.left.isDown) {
            this.character.x -= 2;
            this.character.play('walk', true);
        } else if (this.cursors.right.isDown) {
            this.character.x += 2;
            this.character.play('walk', true);
        } else if (this.cursors.up.isDown) {
            this.character.y -= 2;
            this.character.play('walk', true);
        } else if (this.cursors.down.isDown) {
            this.character.y += 2;
            this.character.play('walk', true);
        } else {
            // Stop moving
            this.character.play('idle', true);
        }

        // Attack logic with Spacebar
        if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) {
            this.character.play('attack', true);
        }

        // Left jab logic with A key
        if (Phaser.Input.Keyboard.JustDown(this.keys.leftjab)) {
            this.character.play('leftjab', true);
        }

        // Right jab logic with D key
        if (Phaser.Input.Keyboard.JustDown(this.keys.rightjab)) {
            this.character.play('rightjab', true);
        }

        // Block logic with S key
        if (Phaser.Input.Keyboard.JustDown(this.keys.block)) {
            this.character.play('block', true);
        }
    }
}

