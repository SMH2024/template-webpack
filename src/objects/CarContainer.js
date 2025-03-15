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

    // Create the sprite with physics using the new car body image
    this.sprite = this.scene.add.sprite(0, 0, 'car-body');
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
    
    // Create wheel visualization using the provided wheel images
    this.wheels = [];
    
    // Define wheel positions and corresponding images
    const wheelPositions = [
      { x: this.AXEL_LENGTH / 2, y: -this.AXEL_WIDTH / 2, key: 'wheel1' },  // front-left
      { x: this.AXEL_LENGTH / 2, y: this.AXEL_WIDTH / 2, key: 'wheel2' },   // front-right
      { x: -this.AXEL_LENGTH / 2, y: -this.AXEL_WIDTH / 2, key: 'wheel3' }, // rear-left
      { x: -this.AXEL_LENGTH / 2, y: this.AXEL_WIDTH / 2, key: 'wheel4' }   // rear-right
    ];
    
    // Create each wheel sprite
    wheelPositions.forEach(pos => {
      const wheel = this.scene.add.sprite(pos.x, pos.y, pos.key);
      wheel.setScale(0.2); // Adjust scale as needed to fit your car
      
      // Add wheels to the car container
      this.carContainer.add(wheel);
      this.wheels.push(wheel);
    });
    
    // Create and add the car body sprite
    this.carBody = this.scene.add.sprite(0, 0, 'car-body');
    this.carBody.setScale(0.3); // Adjust scale as needed
    
    // Add the car body to the car container
    this.carContainer.add(this.carBody);
    
    // Add the car container to the main container
    this.add(this.carContainer);
  }
  
  // To be overridden by child classes
  preUpdate() {}
} 