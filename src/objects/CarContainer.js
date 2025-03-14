import Phaser from 'phaser';

export default class CarContainer extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    
    // Set up basic car dimensions
    this.CHASSIS_LENGTH = 80;
    this.CHASSIS_WIDTH = 40;
    this.AXEL_WIDTH = this.CHASSIS_WIDTH + 10;
    this.AXEL_LENGTH = this.CHASSIS_LENGTH - 20;
    
    // Create visual components of the car
    this.createCarVisuals();
    
    // Set container properties
    this.setSize(this.CHASSIS_LENGTH, this.CHASSIS_WIDTH);
    this.setDepth(2);
    
    // Add container to the scene
    this.scene.add.existing(this);
    
    // Enable physics on this container if Matter physics is available
    if (this.scene.matter && this.scene.matter.add) {
      this.sprite = this.scene.matter.add.gameObject(this);
      this.body = this.sprite.body;
    } else {
      console.warn('Matter physics not available. Car will not have physics behavior.');
      this.sprite = null;
      this.body = null;
    }
    
    // Store current direction information
    this.currentDirection = 'right';
    this.directionIndex = 2; // Starting with east/right direction
  }
  
  createCarVisuals() {
    // Create a placeholder for the car sprite
    // The actual sprite will be set by extended classes
    this.chassis = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'car-east');
    
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
        
        this.wheels.push(wheel);
      }
    }
    
    // Add components to the container
    this.add(this.wheels);
    this.add(this.chassis);
  }
  
  // To be overridden by child classes
  preUpdate() {}
} 