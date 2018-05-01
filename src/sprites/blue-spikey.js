export default class BlueSpikey extends Phaser.GameObjects.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, config.key);
		config.scene.physics.world.enable(this);
		config.scene.add.existing(this);
		this.body.setCollideWorldBounds(true);
		this.speed = -75;
	}

	update() {
		if (this.body.blocked.right || this.body.blocked.left) {
			this.speed = -this.speed;
			this.flipX = this.speed > 0;
		}
		this.body.velocity.x = this.speed;
		this.anims.play('enemyWalk', true);
	}
}
