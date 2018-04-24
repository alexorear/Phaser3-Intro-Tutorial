import 'phaser';

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	input: {
		gamepad: true
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);

var config;
var cursors;
var platforms;
var player;
var score = 0;
var scoreText;
var stars;

function preload() {
	this.load.image('sky', 'assets/sky.png');
	this.load.image('ground', 'assets/platform.png');
	this.load.image('star', 'assets/star.png');
	this.load.image('bomb', 'assets/bomb.png');
	this.load.spritesheet('dude', 'assets/dude.png',
		{ frameWidth: 32, frameHeight: 48 }
	);
}

function create() {
	this.add.image(0, 0, 'sky').setOrigin(0, 0);

	// level platforms
	platforms = this.physics.add.staticGroup();
	platforms.create(400, 568, 'ground').setScale(2).refreshBody();
	platforms.create(600, 400, 'ground');
	platforms.create(50, 250, 'ground');
	platforms.create(750, 220, 'ground');

	//set up scoring
	scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF'});
	// player character
	player = this.physics.add.sprite(100, 450, 'dude');
	player.setBounce(0.2);
	player.setCollideWorldBounds(true);

	this.anims.create({
		key: 'left',
		frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1
	});

	this.anims.create({
		key: 'turn',
		frames: [{ key: 'dude', frame: 4 }],
		frameRate: 20
	});

	this.anims.create({
		key: 'right',
		frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1
	});

	// set collision between player and platforms
	this.physics.add.collider(player, platforms);

	// star objects
	stars = this.physics.add.group({
		key: 'star',
		repeat: 11,
		setXY: { x: 12, y: 0, stepX: 70 }
	});

	stars.children.iterate((child) => {
		child.setBounceY(Phaser.Math.FloatBetween(.4, .8));
	});

	// set collision between stars and platforms
	this.physics.add.collider(stars, platforms);

	// set collision between stars and player
	this.physics.add.overlap(player, stars, collectStar, null, this);

	// set user controlls
	cursors = this.input.keyboard.createCursorKeys();
	// set up gamepad config
	config = Phaser.Input.Gamepad.Configs.XBOX_360;
}

function update() {

	// check to see if gamepad is connected
	if (this.input.gamepad.total !== 0) {
		// gamepad variables
		var pad = this.input.gamepad.getPad(0);
		var axisH = pad.axes[0].getValue();
		var axisV = pad.axes[1].getValue();

		// move character left/right with animation
		if (axisH < 0 || pad.buttons[config.LEFT].pressed) {
			player.setVelocityX(-160);
			player.anims.play('left', true);
		} else if (axisH > 0 || pad.buttons[config.RIGHT].pressed) {
			player.setVelocityX(160);
			player.anims.play('right', true);
		} else {
			player.setVelocityX(0);
			player.anims.play('turn');
		}

		// character jump
		if (pad.buttons[config.A].pressed && player.body.touching.down) {
			player.setVelocityY(-330);
		}
	} else {
		// move character left/right with animation
		if (cursors.left.isDown) {
			player.setVelocityX(-160);
			player.anims.play('left', true);
		} else if (cursors.right.isDown) {
			player.setVelocityX(160);
			player.anims.play('right', true);
		} else {
			player.setVelocityX(0);
			player.anims.play('turn');
		}

		// character jump
		if (cursors.up.isDown && player.body.touching.down) {
			player.setVelocityY(-330);
		}
	}
}

function collectStar(player, star) {
	star.disableBody(true, true);

	score += 1;
	scoreText.setText(`Score: ${score}`);
}
