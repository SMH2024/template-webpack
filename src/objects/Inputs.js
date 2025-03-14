export default class Inputs {
  constructor(scene) {
    this.scene = scene;
    
    // Add keyboard keys
    this.keys = this.scene.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      Z: Phaser.Input.Keyboard.KeyCodes.Z
    });
  }
  
  get accelerator() {
    return this.keys.A.isDown;
  }
  
  get breaks() {
    return this.keys.Z.isDown;
  }
  
  get left() {
    return this.keys.left.isDown;
  }
  
  get right() {
    return this.keys.right.isDown;
  }
} 