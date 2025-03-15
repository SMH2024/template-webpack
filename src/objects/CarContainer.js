import Phaser from 'phaser';

export default class CarContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    
    // Set up basic car dimensions
    this.CHASSIS_LENGTH = 80;
    this.CHASSIS_WIDTH = 40;
    this.AXEL_WIDTH = this.CHASSIS_WIDTH + 10;
    this.AXEL_LENGTH = this.CHASSIS_LENGTH - 20;
    
    // Create the physics body first
    this.createPhysicsBody();
    
    // Create visual components of the car
    this.createCarVisuals();
    
    // Set container properties
    this.setSize(this.CHASSIS_LENGTH, this.CHASSIS_WIDTH);
    this.setDepth(2);
    
    // Add container to the scene
    this.scene.add.existing(this);
    
    // Store current direction information
    this.currentDirection = 'right';
    this.directionIndex = 2; // Starting with east/right direction
  }
  
  createPhysicsBody() {
    if (!this.scene.matter || !this.scene.matter.add) {
      console.warn('Matter physics not available. Car will not have physics behavior.');
      this.sprite = null;
      this.body = null;
      return;
    }

    // Create the sprite with physics
    this.sprite = this.scene.add.sprite(0, 0, 'car-east');
    this.sprite.setOrigin(0.5, 0.5);
    
    // Enable physics on the sprite
    this.scene.matter.world.add(this.sprite);
    this.body = this.sprite.body;
    
    // Configure the physics body
    if (this.body) {
      // Set the body's shape to match the car's dimensions
      this.body.setRectangle(this.CHASSIS_LENGTH, this.CHASSIS_WIDTH);
      
      // Set physics properties for better acceleration response
      this.body.mass = 0.5;           // Reduced mass for better acceleration
      this.body.inertia = 0.5;        // Reduced inertia for better rotation
      this.body.friction = 0.05;      // Reduced friction for better movement
      this.body.frictionAir = 0.005;  // Reduced air friction for better speed
      this.body.restitution = 0.2;    // Slightly increased bounce for better feel
      
      // Make sure the body's center matches the sprite's center
      this.body.centerOffset = { x: 0, y: 0 };
      
      // Set the body's position to match the sprite
      this.body.position = { x: this.sprite.x, y: this.sprite.y };
      
      // Enable continuous collision detection for better physics
      this.body.collisionFilter = {
        group: 0,
        category: 0x0001,
        mask: 0xFFFFFFFF
      };
      
      // Set maximum speed to prevent unrealistic velocities
      this.body.maxSpeed = 10;
    }
  }
  
  createCarVisuals() {
    // Create a container for the car visuals
    this.carContainer = this.scene.add.container(0, 0);
    
    // Create wheel visualization (mainly for debugging)
    this.wheels = [];
    for (let iy = 0; iy < 2; iy++) {
      for (let ix = 0; ix < 2; ix++) {
        const wheel = new Phaser.GameObjects.Rectangle(
          this.scene,
          this.AXEL_LENGTH / 2 - iy * this.AXEL_LENGTH,
          -this.AXEL_WIDTH / 2 + ix * this.AXEL_WIDTH,
          12,
          6,
          0x000000
        );
        
        // Add wheels to the car container
        this.carContainer.add(wheel);
        this.wheels.push(wheel);
      }
    }
    
    // Add the sprite to the car container
    this.carContainer.add(this.sprite);
    
    // Add the car container to the main container
    this.add(this.carContainer);
  }
  
  // To be overridden by child classes
  preUpdate() {}
} 