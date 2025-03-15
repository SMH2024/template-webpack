import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload() {
        // Load the isometric pixel tile
        this.load.image('iso-pixel', 'assets/isometric/isometric_pixel_0215.png');
        
        // Load the car spritesheet
        this.load.spritesheet('car', 
            'assets/isometric/cars/blackcaralldirections.png',
            { frameWidth: 100, frameHeight: 100 }
        );
    }

    create ()
    {
        // Set sky blue background
        this.cameras.main.setBackgroundColor(0x87ceeb);

        // Create a large flat testing area
        this.createTestingArea();
        
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
        
        this.directionText = this.add.text(10, 70, 'Direction: none', {
            fontSize: '16px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setScrollFactor(0);
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
    
    createCar() {
        // Create car animations for 8 directions
        this.createCarAnimations();
        
        // Place car at the center of the test area
        const startX = this.cameras.main.centerX;
        const startY = this.cameras.main.centerY;
        
        // Create car sprite
        this.car = this.add.sprite(startX, startY, 'car');
        this.car.setScale(0.7); // Adjust scale if needed
        
        // Set initial direction and speed
        this.car.direction = 'right'; // Initial direction
        this.car.speed = 0;
        this.car.maxSpeed = 3;
        this.car.acceleration = 0.1;
        this.car.deceleration = 0.05;
        
        // Play initial animation
        this.car.anims.play('car-right');
        
        // Make camera follow the car
        this.cameras.main.startFollow(this.car);
    }
    
    createCarAnimations() {
        // Define car frames for 8 directions
        // Since the spritesheet has each direction in a frame, we can map them directly
        const directions = [
            'down',         // Frame 0
            'down-right',   // Frame 1
            'right',        // Frame 2
            'up-right',     // Frame 3
            'up',           // Frame 4
            'up-left',      // Frame 5
            'left',         // Frame 6
            'down-left'     // Frame 7
        ];
        
        // Create an animation for each direction
        directions.forEach((direction, index) => {
            this.anims.create({
                key: `car-${direction}`,
                frames: [{ key: 'car', frame: index }],
                frameRate: 10,
                repeat: -1
            });
        });
    }
    
    setupCameraControls() {
        // Set up keyboard input
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    // Convert tile coordinates to world coordinates
    tileToWorldX(x, y) {
        return this.trackOriginX + ((x - y) * this.tileWidth / 2);
    }
    
    tileToWorldY(x, y) {
        return this.trackOriginY + ((x + y) * this.tileHeight / 2);
    }
    
    // Convert world coordinates to tile coordinates (approximate)
    worldToTileCoords(worldX, worldY) {
        const relativeX = worldX - this.trackOriginX;
        const relativeY = worldY - this.trackOriginY;
        
        // Convert from isometric to cartesian coordinates
        const cartX = (2 * relativeY + relativeX) / this.tileWidth;
        const cartY = (2 * relativeY - relativeX) / this.tileWidth;
        
        return {
            x: Math.floor(cartX),
            y: Math.floor(cartY)
        };
    }
    
    // Always return true for the test area - no boundary restrictions
    isOnTrack(worldX, worldY) {
        return true; // No boundary restrictions for testing
    }
    
    update() {
        // Handle car movement based on arrow keys
        this.handleCarMovement();
        
        // Update debug info
        this.updateDebugInfo();
    }
    
    updateDebugInfo() {
        // Update speed text
        this.speedText.setText(`Speed: ${this.car.speed.toFixed(2)}`);
        
        // Update direction text
        this.directionText.setText(`Direction: ${this.car.direction}`);
    }
    
    handleCarMovement() {
        // Store the current position for reverting if needed
        const prevX = this.car.x;
        const prevY = this.car.y;
        
        // Reset speed when no keys are pressed
        if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
            // Natural deceleration
            if (this.car.speed > 0) {
                this.car.speed = Math.max(0, this.car.speed - this.car.deceleration);
            } else if (this.car.speed < 0) {
                this.car.speed = Math.min(0, this.car.speed + this.car.deceleration);
            }
        }
        
        // Handle acceleration and direction
        if (this.cursors.up.isDown) {
            // Accelerate forward
            this.car.speed = Math.min(this.car.maxSpeed, this.car.speed + this.car.acceleration);
        } else if (this.cursors.down.isDown) {
            // Accelerate backward
            this.car.speed = Math.max(-this.car.maxSpeed/2, this.car.speed - this.car.acceleration);
        }
        
        // Determine direction based on arrow keys
        let directionChanged = false;
        let direction = '';
        
        if (this.cursors.up.isDown) {
            if (this.cursors.left.isDown) {
                direction = 'up-left';
            } else if (this.cursors.right.isDown) {
                direction = 'up-right';
            } else {
                direction = 'up';
            }
            directionChanged = true;
        } else if (this.cursors.down.isDown) {
            if (this.cursors.left.isDown) {
                direction = 'down-left';
            } else if (this.cursors.right.isDown) {
                direction = 'down-right';
            } else {
                direction = 'down';
            }
            directionChanged = true;
        } else if (this.cursors.left.isDown) {
            direction = 'left';
            directionChanged = true;
        } else if (this.cursors.right.isDown) {
            direction = 'right';
            directionChanged = true;
        }
        
        // Update car animation if direction changed
        if (directionChanged && direction !== '') {
            this.car.direction = direction;
            this.car.anims.play(`car-${direction}`);
        }
        
        // Move car based on current direction and speed
        if (this.car.speed !== 0) {
            let dx = 0;
            let dy = 0;
            
            // Calculate movement based on direction
            switch(this.car.direction) {
                case 'up':
                    dy = -this.car.speed;
                    break;
                case 'up-right':
                    dx = this.car.speed * 0.7;
                    dy = -this.car.speed * 0.7;
                    break;
                case 'right':
                    dx = this.car.speed;
                    break;
                case 'down-right':
                    dx = this.car.speed * 0.7;
                    dy = this.car.speed * 0.7;
                    break;
                case 'down':
                    dy = this.car.speed;
                    break;
                case 'down-left':
                    dx = -this.car.speed * 0.7;
                    dy = this.car.speed * 0.7;
                    break;
                case 'left':
                    dx = -this.car.speed;
                    break;
                case 'up-left':
                    dx = -this.car.speed * 0.7;
                    dy = -this.car.speed * 0.7;
                    break;
            }
            
            // Update car position
            this.car.x += dx;
            this.car.y += dy;
            
            // No boundary check for testing purposes
        }
    }
}
