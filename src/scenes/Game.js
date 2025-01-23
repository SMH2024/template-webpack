import { Scene } from 'phaser';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    preload() {
        // Load character sprite sheet
        this.load.spritesheet('characterKey', 'assets/character.png', {
            frameWidth: 32,
            frameHeight: 48
        });
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

        // Create character animations
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('characterKey', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('characterKey', { start: 4, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('characterKey', { start: 10, end: 14 }),
            frameRate: 15,
            repeat: 0
        });

        this.anims.create({
            key: 'leftjab',
            frames: this.anims.generateFrameNumbers('characterKey', { start: 15, end: 18 }),
            frameRate: 15,
            repeat: 0
        });

        this.anims.create({
            key: 'rightjab',
            frames: this.anims.generateFrameNumbers('characterKey', { start: 19, end: 22 }),
            frameRate: 15,
            repeat: 0
        });

        this.anims.create({
            key: 'block',
            frames: this.anims.generateFrameNumbers('characterKey', { start: 23, end: 25 }),
            frameRate: 10,
            repeat: 0
        });

        // Example sprite
        this.character = this.add.sprite(400, 300, 'characterKey');
        this.character.setScale(2);

        // Add physics
        this.physics.add.existing(this.character);
        this.character.body.setCollideWorldBounds(true);

        // Set world bounds
        this.physics.world.setBounds(0, 0, 800, 600);

        // Play idle animation initially
        this.character.play('idle');
    }

    update() {
        // Movement logic with arrow keys
        if (this.cursors.left.isDown) {
            this.character.x -= 120 * (this.game.loop.delta / 1000);
            this.character.play('walk', true);
            this.character.flipX = true;
        } else if (this.cursors.right.isDown) {
            this.character.x += 120 * (this.game.loop.delta / 1000);
            this.character.play('walk', true);
            this.character.flipX = false;
        } else if (this.cursors.up.isDown) {
            this.character.y -= 120 * (this.game.loop.delta / 1000);
            this.character.play('walk', true);
        } else if (this.cursors.down.isDown) {
            this.character.y += 120 * (this.game.loop.delta / 1000);
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
    

