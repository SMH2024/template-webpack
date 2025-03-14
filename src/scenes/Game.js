import { Scene } from 'phaser';
import { CarPlayer, Inputs } from '../objects';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // Set sky blue background
        this.cameras.main.setBackgroundColor(0x87ceeb);

        // Create a large flat test area
        this.createTestArea();
        
        // Setup input system
        this.setupInputs();
        
        // Setup road for skid marks
        this.setupRoad();
        
        // Add car to the scene
        this.createCar();
        
        // Debug info
        this.debugText = this.add.text(10, 10, 'Debug: No data yet', {
            fontSize: '16px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#00000080',
            padding: {
                x: 8,
                y: 8
            }
        }).setScrollFactor(0);
        
        // Instructions
        this.add.text(10, 100, 'Left/Right: Turn car gradually\nA: Accelerate\nZ: Brake/Reverse\nPhysics-based car controls!', {
            fontSize: '18px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);
    }

    createTestArea() {
        // Create a group to hold all tiles
        this.tiles = this.add.group();
        
        // Get tile dimensions from the loaded tile
        const tileImage = this.textures.get('iso-pixel');
        const tileWidth = tileImage.source[0].width;
        const tileHeight = tileImage.source[0].height / 2; // We use half height for isometric projection
        
        // Define a large grid size
        const gridSize = 30; // 30x30 grid
        
        // Center position
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        // Create a large flat area of tiles
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                // Calculate isometric position
                const isoX = (x - y) * tileWidth / 2;
                const isoY = (x + y) * tileHeight / 2;
                
                // Create tile
                const tile = this.add.image(centerX + isoX, centerY + isoY, 'iso-pixel');
                
                // Set the origin for proper alignment
                tile.setOrigin(0.5, 0.5);
                
                // Add to the group
                this.tiles.add(tile);
            }
        }
        
        // Store reference positions
        this.trackOriginX = centerX - (gridSize * tileWidth / 4);
        this.trackOriginY = centerY - (gridSize * tileHeight / 4);
    }
    
    setupRoad() {
        // Create a graphics object for drawing tire marks
        this.road = this.add.graphics();
        this.road.setDepth(1);
        this.road.lineStyle(1, 0x333333, 0.5);
    }
    
    setupInputs() {
        // Initialize input system
        this.inputs = new Inputs(this);
    }
    
    createCar() {
        // Create animations for the car
        this.createCarAnimations();
        
        // Place car at the center
        const startX = this.cameras.main.centerX;
        const startY = this.cameras.main.centerY;
        
        // Create physics-based car player
        this.car = new CarPlayer(this, startX, startY);
        
        // Make camera follow the car
        this.cameras.main.startFollow(this.car);
    }
    
    createCarAnimations() {
        // Direction mapping between game direction names and file names
        const directionMap = {
            'up': 'north',
            'up-right': 'northeast',
            'right': 'east',
            'down-right': 'southeast',
            'down': 'south',
            'down-left': 'southwest',
            'left': 'west',
            'up-left': 'northwest'
        };
        
        // Create an animation for each direction using all 12 frames
        Object.entries(directionMap).forEach(([gameDir, fileDir]) => {
            // Create frame numbers array for all 12 frames
            const frames = Array.from({ length: 12 }, (_, i) => i);
            
            this.anims.create({
                key: `car-${gameDir}`,
                frames: this.anims.generateFrameNumbers(`car-${fileDir}`, { frames }),
                frameRate: 15, // Higher frame rate for smoother animation
                repeat: -1 // Loop animation
            });
        });
    }
    
    update() {
        // Update physics-based car (already handles input)
        this.car.preUpdate();
        
        // Update debug info
        this.updateDebugInfo();
    }
    
    updateDebugInfo() {
        // Safely get car data for debugging
        const directionIndex = this.car ? this.car.getData('directionIndex') : 0;
        const turnCooldown = this.car ? this.car.getData('turnCooldown') : 0;
        const directions = this.car ? this.car.getData('directions') : [];
        const currentDirection = directions && directionIndex !== undefined ? directions[directionIndex] : 'unknown';
        
        // Safely get physics data
        const velocity = this.car && this.car.body ? this.car.body.velocity : { x: 0, y: 0 };
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        const angle = this.car ? this.car.rotation * (180 / Math.PI) : 0;
        
        // Get car position
        const carX = this.car ? this.car.x : 0;
        const carY = this.car ? this.car.y : 0;
        
        // Show car direction, speed, and key states for debugging
        this.debugText.setText(
            `Direction: ${currentDirection} (${directionIndex}/8)\n` +
            `Speed: ${speed.toFixed(2)}\n` +
            `Angle: ${angle.toFixed(1)}°\n` +
            `Turn Cooldown: ${turnCooldown}\n` +
            `Position: ${Math.round(carX)}, ${Math.round(carY)}\n` +
            `Keys: ${this.inputs.left ? '←' : ' '}${this.inputs.right ? '→' : ' '}\n` +
            `A: ${this.inputs.accelerator ? 'PRESSED' : 'released'} Z: ${this.inputs.breaks ? 'PRESSED' : 'released'}`
        );
    }
}
