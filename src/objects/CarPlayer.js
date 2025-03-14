import CarContainer from './CarContainer';

export default class CarPlayer extends CarContainer {
  constructor(scene, x, y) {
    super(scene, x, y);
    
    // Set car physics properties
    const props = {
      angularGrip: 0.05,        // How well the car resists angular velocity changes
      grip: 0.03,               // How well the car grips the road
      powerForward: 0.03,       // Acceleration power going forward
      powerReverse: 0.015,      // Acceleration power going reverse
      turnMax: 40 * Math.PI / 180,  // Maximum turning angle in radians
      turnRate: 10 * Math.PI / 180  // How fast the car can turn in radians
    };
    
    // Calculate derived properties
    this.setData({
      ...props,
      drag: 1 - props.grip,
      angularDrag: 1 - props.angularGrip,
      wheelAngle: 0,
      
      // Store the 8 directions for animation
      directions: [
        'up',           // 0
        'up-right',     // 1
        'right',        // 2
        'down-right',   // 3
        'down',         // 4
        'down-left',    // 5
        'left',         // 6
        'up-left'       // 7
      ],
      directionMapping: {
        'up': 'north',
        'up-right': 'northeast',
        'right': 'east',
        'down-right': 'southeast',
        'down': 'south',
        'down-left': 'southwest',
        'left': 'west',
        'up-left': 'northwest'
      },
      directionIndex: 2, // Start facing right
      turnCooldown: 0
    });
    
    // Update chassis sprite
    this.updateCarSprite();
  }
  
  updateCarSprite() {
    const directions = this.getData('directions');
    const currentDirection = directions[this.getData('directionIndex')];
    const directionMapping = this.getData('directionMapping');
    const spriteKey = `car-${directionMapping[currentDirection]}`;
    
    // Update the chassis sprite
    this.chassis.setTexture(spriteKey);
    this.chassis.anims.play(`car-${currentDirection}`, true);
    
    // Store current direction
    this.currentDirection = currentDirection;
  }
  
  preUpdate() {
    const TURN_COEFFICIENT = 0.1;
    const SPEED_MIN = 0.1;
    
    const { left, right, accelerator, breaks } = this.scene.inputs;
    
    // Safely get body properties with fallbacks for undefined values
    const position = this.body ? this.body.position : { x: this.x, y: this.y };
    const positionPrev = this.body ? (this.body.positionPrev || position) : { x: this.x, y: this.y };
    const speed = this.body ? this.body.speed || 0 : 0;
    const angularVelocity = this.body ? this.body.angularVelocity || 0 : 0;
    
    // Get car properties
    const [
      wheelAngle,
      powerForward,
      powerReverse,
      turnMax,
      turnRate,
      grip,
      drag,
      angularGrip,
      angularDrag,
      directionIndex,
      turnCooldown,
      directions
    ] = this.getData([
      'wheelAngle',
      'powerForward',
      'powerReverse',
      'turnMax',
      'turnRate',
      'grip',
      'drag',
      'angularGrip',
      'angularDrag',
      'directionIndex',
      'turnCooldown',
      'directions'
    ]);
    
    // Handle turn cooldown
    let newTurnCooldown = Math.max(0, turnCooldown - 1);
    this.setData('turnCooldown', newTurnCooldown);
    
    // Apply physics calculations
    const speedNew = breaks ? -speed : speed;
    const power = accelerator ? powerForward : breaks ? -powerReverse : 0;
    
    // Set velocity based on current rotation and speed
    const velocity = new Phaser.Math.Vector2(
      (position.x - positionPrev.x) * drag + 
      Math.cos(this.rotation) * (speedNew * grip + power),
      (position.y - positionPrev.y) * drag + 
      Math.sin(this.rotation) * (speedNew * grip + power)
    );
    
    // Make sure sprite is initialized before setting velocity
    if (this.sprite) {
      this.sprite.setVelocity(velocity.x, velocity.y);
    }
    
    // Handle angular velocity and steering
    let angle = wheelAngle;
    let angularVelocityNew = angularVelocity * angularDrag;
    let newDirectionIndex = directionIndex;
    let directionChanged = false;
    
    // Handle turning with left/right keys
    if (left || right) {
      if (newTurnCooldown === 0) {
        if (right) {
          // Turn clockwise
          newDirectionIndex = (directionIndex + 1) % 8;
          directionChanged = true;
          newTurnCooldown = 10; // Add cooldown to prevent too rapid turning
        } else if (left) {
          // Turn counter-clockwise
          newDirectionIndex = (directionIndex + 7) % 8; // +7 is equivalent to -1 with wrap around
          directionChanged = true;
          newTurnCooldown = 10; // Add cooldown to prevent too rapid turning
        }
      }
      
      // Apply wheel angle for physics steering
      const angularCoefficient = Math.sign(Math.floor(speedNew / SPEED_MIN)) * TURN_COEFFICIENT;
      const angularRate = (left ? -1 : 1) * turnRate;
      
      angle = Math.min(Math.max(angle + angularRate, -turnMax), turnMax);
      angularVelocityNew += angularCoefficient * angle * angularGrip;
    } else if (angle !== 0) {
      // Return wheels to center when not turning
      angle = angle > 0 ? 
        Math.max(angle - turnRate, 0) : 
        Math.min(angle + turnRate, 0);
    }
    
    // Apply the new angular velocity if sprite exists
    if (this.sprite) {
      this.sprite.setAngularVelocity(angularVelocityNew);
    }
    
    // Update wheels visually to match steering angle if wheels exist
    if (this.wheels && this.wheels.length >= 2) {
      const [wheel1, wheel2] = this.wheels;
      wheel1.setRotation(angle);
      wheel2.setRotation(angle);
    }
    
    // Save updated wheel angle
    this.setData('wheelAngle', angle);
    
    // Update turn cooldown
    this.setData('turnCooldown', newTurnCooldown);
    
    // Update direction if changed
    if (directionChanged) {
      this.setData('directionIndex', newDirectionIndex);
      this.updateCarSprite();
    }
    
    // Calculate real-world direction based on velocity
    if (Math.abs(velocity.x) > 0.1 || Math.abs(velocity.y) > 0.1) {
      const velocityAngle = Math.atan2(velocity.y, velocity.x);
      const directionAngle = velocityAngle * (180 / Math.PI);
      
      // Map angle to one of 8 directions for animation
      const snapAngle = Math.round(directionAngle / 45) * 45;
      const snapIndex = ((snapAngle / 45) + 10) % 8; // +10 to handle negative angles
      
      // Only update if direction has changed significantly
      if (Math.abs(snapIndex - directionIndex) > 1 && Math.abs(snapIndex - directionIndex) < 7) {
        // this.setData('directionIndex', snapIndex);
        // this.updateCarSprite();
      }
    }
    
    // Draw tire marks if drifting and road exists
    if (Math.abs(angularVelocity) > 0.03 && Math.abs(speedNew) > 0.5 && this.scene.road) {
      const markAngle = new Phaser.Math.Vector2(position)
        .subtract(new Phaser.Math.Vector2(positionPrev))
        .angle();
      const markLength = new Phaser.Math.Vector2(2, 0).setAngle(markAngle);
      const markY = new Phaser.Math.Vector2(6, 0).setAngle(this.rotation);
      const markX = new Phaser.Math.Vector2(5, 0).setAngle(
        this.rotation + Math.PI / 2
      );
      const markPosLeft = new Phaser.Math.Vector2(this.x, this.y)
        .subtract(markX)
        .subtract(markY);
      const markPosRight = new Phaser.Math.Vector2(this.x, this.y)
        .add(markX)
        .subtract(markY);

      this.scene.road.strokeLineShape(
        new Phaser.Geom.Line(
          markPosLeft.x - markLength.x,
          markPosLeft.y - markLength.y,
          markPosLeft.x + markLength.x,
          markPosLeft.y + markLength.y
        )
      );

      this.scene.road.strokeLineShape(
        new Phaser.Geom.Line(
          markPosRight.x - markLength.x,
          markPosRight.y - markLength.y,
          markPosRight.x + markLength.x,
          markPosRight.y + markLength.y
        )
      );
    }
  }
} 