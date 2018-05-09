export default class NinjaCat extends Phaser.GameObjects.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);
		this.body.setCollideWorldBounds(true);
		this.acceleration = 300;
		this.body.maxVelocity.x = 200;
		this.body.maxVelocity.y = 500;
		this.wasHurt = -1;
		this.jumpCount = 0;
	}

	update(padConfig, keys) {
		// check to see if gamepad is connected
		if (this.scene.input.gamepad.total) {
			// gamepad variables
			var pad = this.scene.input.gamepad.getPad(0);
			var axisH = pad.axes[0].getValue();

			if (axisH < 0 || pad.buttons[padConfig.LEFT].pressed) {
				this.flipX = true;
				this.body.velocity.x = -100;
			} else if (axisH > 0 || pad.buttons[padConfig.RIGHT].pressed) {
				this.flipX = false;
				this.body.velocity.x = 100;
			} else {
				this.body.velocity.x = 0;
			}

			// character jump with gamepad
			if (pad.buttons[padConfig.A].pressed && this.body.blocked.down) {
				this.jumpCount = 1;
				this.body.velocity.y = -250;
			} else if (pad.buttons[padConfig.A].pressed && this.jumpCount != 0) {
				if (this.jumpCount < 30) {
					this.jumpCount++;
					this.body.velocity.y = -250 + (this.jumpCount * 3);
				}
			} else if (this.jumpCount !=0) {
				this.jumpCount = 0;
			}

		} else {
			// move character left/right with keyboard
			if (keys.left.isDown) {
				this.flipX = true;
				this.body.velocity.x = -100;
			} else if (keys.right.isDown) {
				this.flipX = false;
				this.body.velocity.x = 100;
			} else {
				this.body.velocity.x = 0;
			}

			// character jump with keyboard
			if (keys.jump.isDown && this.body.blocked.down) {
				this.jumpCount = 1;
				this.body.velocity.y = -250;
			} else if (keys.jump.isDown && this.jumpCount != 0) {
				if (this.jumpCount < 30) {
					this.jumpCount++;
					this.body.velocity.y = -250 + (this.jumpCount * 3);
				}
			} else if (this.jumpCount !=0) {
				this.jumpCount = 0;
			}
		}

		// set animation based on velocity state
		if (this.body.velocity.y) {
			this.anims.play('jump', true);
		} else if (this.body.velocity.x) {
			this.anims.play('walk', true);
		} else if (!this.body.allowGravity) {
			this.anims.play('catClimb', true);
		} else {
			this.anims.play('stand', true);
		}
	}

	run(vel) {
		this.body.setAccelerationX(vel);
	}
}
