export default class NinjaCat extends Phaser.GameObjects.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);
		this.body.setCollideWorldBounds(true);
		this.wasHurt = -1;
		this.jumpCount = 0;
	}

	update(padConfig, keys) {
		// check to see if gamepad is connected
		if (this.scene.input.gamepad.total !== 0) {
			// gamepad variables
			var pad = this.scene.input.gamepad.getPad(0);
			var axisH = pad.axes[0].getValue();

			// move character left/right with gamepad
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
			if (pad.buttons[padConfig.A].pressed && this.jumpCount < 10) {
				this.jump();
			}
			if (this.body.blocked.down) {
				this.jumpCount = 0;
			}
			// scene reset with gamepad
			if (pad.buttons[padConfig.BACK].pressed) {
				this.scene.restart();
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
			if (keys.jump.isDown && this.jumpCount < 10) {
				this.jump();
			}
			if (this.body.blocked.down) {
				this.jumpCount = 0;
			}
			// reset scene with keyboard
			if (keys.reset.isDown) {
				// score = 0;
				this.scene.scene.pause();
				this.scene.scene.restart();
			}
		}

		// set animation based on velocity state
		if (this.body.velocity.y) {
			this.anims.play('jump', true);
		} else if (this.body.velocity.x !== 0) {
			this.anims.play('walk', true);
		} else {
			this.anims.play('stand', true);
		}
	}

	jump() {
		this.jumpCount += 1;
		this.body.setVelocityY(-150 + -(this.jumpCount * 13));
	}
}
