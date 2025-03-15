import CarContainer from './CarContainer';

export default class CarPlayer extends CarContainer {
  constructor(scene, x, y) {
    super(scene, x, y);
    
    // Set simple car properties - keeping it basic and reliable
    this.speed = 0;
    this.maxSpeed = 5;
    this.acceleration = 0.1;
    this.deceleration = 0.05;
    this.turnSpeed = 0.05;
    
    // Keep track of direction
    this.directionIndex = 2; // Start facing right
  }
  
  preUpdate() {
    // Get input state
    const { left, right, accelerator, breaks } = this.scene.inputs;
    
    // 1. Handle acceleration (A key)
    if (accelerator) {
      this.speed += this.acceleration;
      if (this.speed > this.maxSpeed) {
        this.speed = this.maxSpeed;
      }
    }
    // 2. Handle braking/reverse (Z key)
    else if (breaks) {
      this.speed -= this.acceleration;
      if (this.speed < -this.maxSpeed/2) { // Slower in reverse
        this.speed = -this.maxSpeed/2;
      }
    }
    // 3. Coast - gradual slowdown when no input
    else {
      if (this.speed > 0) {
        this.speed -= this.deceleration;
        if (this.speed < 0) this.speed = 0;
      } else if (this.speed < 0) {
        this.speed += this.deceleration;
        if (this.speed > 0) this.speed = 0;
      }
    }
    
    // 4. Handle turning - update car rotation
    if (left && Math.abs(this.speed) > 0.1) {
      this.rotation -= this.turnSpeed;
      
      // Rotate wheel sprites for visualization
      if (this.wheels && this.wheels.length === 4) {
        this.wheels[0].rotation = -0.2; // front-left wheel turns
        this.wheels[1].rotation = -0.2; // front-right wheel turns
      }
    } else if (right && Math.abs(this.speed) > 0.1) {
      this.rotation += this.turnSpeed;
      
      // Rotate wheel sprites for visualization
      if (this.wheels && this.wheels.length === 4) {
        this.wheels[0].rotation = 0.2; // front-left wheel turns
        this.wheels[1].rotation = 0.2; // front-right wheel turns
      }
    } else {
      // Reset wheel rotation when not turning
      if (this.wheels && this.wheels.length === 4) {
        this.wheels[0].rotation = 0;
        this.wheels[1].rotation = 0;
      }
    }
    
    // 5. Calculate velocity based on car's rotation and speed
    const velocityX = Math.cos(this.rotation) * this.speed;
    const velocityY = Math.sin(this.rotation) * this.speed;
    
    // 6. Apply physics
    if (this.body) {
      this.body.velocity.x = velocityX;
      this.body.velocity.y = velocityY;
    }
    
    // 7. Draw tire marks if moving fast enough and turning
    if (Math.abs(this.speed) > 0.5 && (left || right) && this.scene.road) {
      this.drawTireMarks();
    }
    
    // 8. Animate wheels based on speed
    this.animateWheels();
  }
  
  animateWheels() {
    // Only proceed if we have wheels
    if (!this.wheels || this.wheels.length !== 4) return;
    
    // Rotate wheels based on speed
    const wheelRotationSpeed = this.speed * 0.1;
    
    // Apply rotation to all wheels
    this.wheels.forEach(wheel => {
      // Add to the current rotation - this creates a continuous spin effect
      // The y position affects the direction of rotation for visual accuracy
      wheel.rotation += wheelRotationSpeed;
    });
  }
  
  drawTireMarks() {
    // Simple tire mark drawing
    if (!this.scene.road) return;
    
    const markX = new Phaser.Math.Vector2(5, 0).setAngle(this.rotation + Math.PI/2);
    const markY = new Phaser.Math.Vector2(6, 0).setAngle(this.rotation);
    
    const leftPos = new Phaser.Math.Vector2(this.x, this.y)
      .subtract(markX).subtract(markY);
    const rightPos = new Phaser.Math.Vector2(this.x, this.y)
      .add(markX).subtract(markY);
      
    // Draw small dots for tire marks
    this.scene.road.fillStyle(0x333333, 0.4);
    this.scene.road.fillCircle(leftPos.x, leftPos.y, 2);
    this.scene.road.fillCircle(rightPos.x, rightPos.y, 2);
  }
} 