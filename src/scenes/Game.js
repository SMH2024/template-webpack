import { Scene } from 'phaser';
import CarPlayer from '../objects/CarPlayer';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload() {
        // All assets are now loaded in the Preloader scene
    }

    create ()
    {
        // Set sky blue background
        this.cameras.main.setBackgroundColor(0x87ceeb);

        // Create a large flat testing area
        this.createTestingArea();
        
        // Setup inputs for car control
        this.setupInputs();
        
        // Add car to the scene
        this.createCar();
        
        // Add camera controls
        this.setupCameraControls();
        
        // Instructions text
        this.add.text(10, 10, 'Use Arrow Keys to drive car', {
            fontSize: '18px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setScrollFactor(0);
        
        // Debug info
        this.speedText = this.add.text(10, 40, 'Speed: 0', {
            fontSize: '16px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);
    }
    
    setupInputs() {
        // Create input handler for car controls
        this.inputs = {
            left: false,
            right: false,
            accelerator: false,
            breaks: false
        };
        
        // Listen for keyboard events
        this.input.keyboard.on('keydown', (event) => {
            this.updateInputState(event.keyCode, true);
        });
        
        this.input.keyboard.on('keyup', (event) => {
            this.updateInputState(event.keyCode, false);
        });
    }
    
    updateInputState(keyCode, isDown) {
        // Map key codes to input states
        switch (keyCode) {
            case 37: // Left arrow
                this.inputs.left = isDown;
                break;
            case 39: // Right arrow
                this.inputs.right = isDown;
                break;
            case 38: // Up arrow
                this.inputs.accelerator = isDown;
                break;
            case 40: // Down arrow
                this.inputs.breaks = isDown;
                break;
        }
    }
    
    createCar() {
        // Place car at the center of the test area
        const startX = this.cameras.main.centerX;
        const startY = this.cameras.main.centerY;
        
        // Create road graphics for tire marks
        this.road = this.add.graphics();
        
        // Create car using our physics-based car system
        this.car = new CarPlayer(this, startX, startY);
        
        // Make camera follow the car
        this.cameras.main.startFollow(this.car);
    }

    createTestingArea() {
        // Create a group to hold all tiles
        this.tiles = this.add.group();
        
        // Center position calculation
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        // Get tile dimensions from the first loaded tile
        const tileImage = this.textures.get('iso-pixel');
        const tileWidth = tileImage.source[0].width;
        const tileHeight = tileImage.source[0].height / 2; // We use half height for isometric projection
        
        // Create a large flat testing area (20x20 grid)
        const gridSize = 20;
        
        // Store track data - everything is valid track
        this.trackData = Array(gridSize).fill().map(() => Array(gridSize).fill(1));
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                // Calculate isometric position
                const isoX = (x - y) * tileWidth / 2;
                const isoY = (x + y) * tileHeight / 2;
                
                // Create tile using the isometric_pixel_0215.png
                const tile = this.add.image(centerX + isoX, centerY + isoY, 'iso-pixel');
                
                // Set the origin for proper alignment
                tile.setOrigin(0.5, 0.5);
                
                // Add to the group
                this.tiles.add(tile);
            }
        }
        
        // Store track world bounds
        this.trackOriginX = centerX - (gridSize * tileWidth / 4);
        this.trackOriginY = centerY - (gridSize * tileHeight / 4);
    }
    
    setupCameraControls() {
        // Set up keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    updateDebugInfo() {
        // Update speed text
        if (this.car) {
            this.speedText.setText(`Speed: ${this.car.speed.toFixed(2)}`);
        }
    }
    
    tileToWorldX(x, y) {
        return this.trackOriginX + (x - y) * (this.tileWidth / 2);
    }
    
    tileToWorldY(x, y) {
        return this.trackOriginY + (x + y) * (this.tileHeight / 4);
    }
    
    worldToTileCoords(worldX, worldY) {
        // Convert from world coordinates to isometric tile coordinates
        worldX -= this.trackOriginX;
        worldY -= this.trackOriginY;
        
        const tileX = (worldX / (this.tileWidth / 2) + worldY / (this.tileHeight / 4)) / 2;
        const tileY = (worldY / (this.tileHeight / 4) - worldX / (this.tileWidth / 2)) / 2;
        
        return { tileX: Math.floor(tileX), tileY: Math.floor(tileY) };
    }
    
    isOnTrack(worldX, worldY) {
        // Determine if the given world coordinates are on the track
        // This is a placeholder - replace with actual track collision logic
        return true; // For now, the entire area is considered "on track"
    }
    
    update() {
        // Call car's preUpdate method which handles all car physics
        if (this.car) {
            this.car.preUpdate();
        }
        
        // Update debug info
        this.updateDebugInfo();
    }
}
