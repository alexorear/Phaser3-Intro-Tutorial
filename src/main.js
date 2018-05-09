import 'phaser';
import BlueSpikey from './sprites/blue-spikey';
import NinjaCat from './sprites/ninja-cat';

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	roundPixels: true,
	input: {
		gamepad: true
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 600 },
			debug: false
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

// eslint-disable-next-line
var game = new Phaser.Game(config);

var score = 0;
var scoreText;

function preload() {
	this.load.spritesheet('ninjaCat', 'assets/cat.png',
		{ frameWidth: 32, frameHeight: 48 }
	);
	this.load.spritesheet('blueSpikey', 'assets/blue_guy.png',
		{ frameWidth: 32, frameHeight: 32}
	);
	this.load.spritesheet('climb', 'assets/cat_climb.png',
		{ frameWidth: 32, frameHeight: 48 }
	);

	this.load.image('outside_tiles', 'assets/outside_tiles.png');
	this.load.image('star_tile', 'assets/star_tile.png');
	this.load.tilemapTiledJSON('map', 'assets/test_tilemap.json');
}

function create() {
	//tile tilemapTiledJSONthis.map = this.add.tilemap('level1');
	this.map = this.add.tilemap('map');
	var tileset = this.map.addTilesetImage('outside_tiles','outside_tiles');
	var starTileset = this.map.addTilesetImage('star_tile', 'star_tile');
	this.skyLayer = this.map.createStaticLayer('sky', tileset);
	this.backgroundLayer = this.map.createStaticLayer('background', tileset);
	this.stars = this.map.createDynamicLayer('stars', starTileset);
	this.ladder = this.map.createStaticLayer('ladder', tileset);
	this.platform_edges = this.map.createStaticLayer('platform_edge', tileset);
	this.platformLayer = this.map.createStaticLayer('ground', tileset);
	this.stars.setCollision([3073], true);
	this.platform_edges.setCollision([169], true);
	this.platformLayer.setCollision([174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 237, 238, 304, 305, 306, 307, 308, 309], true);

	//set up scoring
	scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});

	// create blue Blue Spikey
	let enemyPosision = [{x: 608, y: 96}, {x: 128, y: 240}, {x: 512, y: 336}, {x: 512, y: 512}];
	this.enemyGroup = this.add.group();
	enemyPosision.forEach((enemy) => {
		let newEnemy;
		newEnemy = new BlueSpikey({
			scene: this,
			key: 'blueSpikey',
			x: enemy.x,
			y: enemy.y,
		});
		this.enemyGroup.add(newEnemy);
	});

	this.anims.create({
		key: 'enemyWalk',
		frames: this.anims.generateFrameNumbers('blueSpikey', { start: 0, end: 5 }),
		frameRate: 8,
		repeat: true
	});

	// create NinjaCat
	this.player = new NinjaCat({
		scene: this,
		key: 'ninjaCat',
		x: 100,
		y: this.sys.game.config.height - 120
	});

	this.anims.create({
		key: 'walk',
		frames: this.anims.generateFrameNumbers('ninjaCat', { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1
	});

	this.anims.create({
		key: 'catClimb',
		frames: this.anims.generateFrameNumbers('climb', { start: 0, end: 1 }),
		frameRate: 7,
		repeat: -1
	});

	this.anims.create({
		key: 'jump',
		frames: this.anims.generateFrameNumbers('ninjaCat', { start: 4, end: 18 }),
		frameRate: 8,
		repeat: -1,
	});

	this.anims.create({
		key: 'stand',
		frames: [ { key: 'ninjaCat', frame: 0 } ],
		frameRate: 3,
		repeat: -1
	});

	// set collision/overlap detection
	this.physics.add.overlap(this.player, this.stars);
	this.stars.setTileIndexCallback([3073], collectStar, this);

	// platform object collision
	this.physics.add.collider(this.player, this.platformLayer);
	this.physics.add.collider(this.enemyGroup, this.platformLayer);
	this.physics.add.collider(this.enemyGroup, this.platform_edges);

	// player and enemy collider
	this.physics.add.collider(this.player, this.enemyGroup, hitEnemy, null, this);
	//tile callbacks
	this.physics.add.overlap(this.player, this.ladder);
	this.ladder.setTileIndexCallback([1583, 1584, 1647, 1648, 1711, 1712], climbLadder, this);
	this.ladder.setTileIndexCallback([1839, 1840], endOfLadderUp, this);
	this.ladder.setTileIndexCallback([1775, 1776,], endOfLadderDown, this);


	// set user controlls
	this.keys = {
		reset: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
		pause: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P),
		jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
		up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
		down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
		left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
		right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
	};
	// set up gamepad config
	this.padConfig = Phaser.Input.Gamepad.Configs.XBOX_360;
}

function update() {
	if (this.input.gamepad.total) {
		this.pad = this.input.gamepad.getPad(0);
		this.axisH = this.pad.axes[0].getValue();
		this.axisV = this.pad.axes[1].getValue();
	}

	this.player.update(this.padConfig, this.keys);
	this.enemyGroup.children.entries.forEach((enemy) => {
		enemy.update();
	});

	// reset scene with keyboard
	if (this.keys.reset.isDown) {
		score = 0;
		this.scene.restart();
	}
}

function collectStar(player, tile) {
	this.stars.removeTileAt(tile.x, tile.y);
	score += 1;
	scoreText.setText(`Score: ${score}`);
}

function endOfLadderUp() {
	// check to see if gamepad is connected
	if (this.input.gamepad.total !== 0) {
		if (this.axisV < 0 || this.pad.buttons[this.padConfig.UP].pressed) {
			this.player.body.allowGravity = true;
		} else if (this.axisV > 0 || this.pad.buttons[this.padConfig.DOWN].pressed) {
			this.player.body.allowGravity = false;
			this.player.body.y = this.player.body.y += .25;
		}
	} else {
		if (this.keys.up.isDown) {
			this.player.body.allowGravity = true;
		} else if (this.keys.down.isDown) {
			this.player.body.allowGravity = false;
			this.player.body.y = this.player.body.y += .25;
		}
	}
}

function endOfLadderDown() {
	// check to see if gamepad is connected
	if (this.input.gamepad.total !== 0) {
		if (this.axisV > 0 || this.pad.buttons[this.padConfig.DOWN].pressed) {
			this.player.body.allowGravity = true;
		} else if (this.axisV < 0 || this.pad.buttons[this.padConfig.UP].pressed) {
			this.player.body.allowGravity = false;
			this.player.body.y = this.player.body.y -= .25;
		}
	} else {
		if (this.keys.down.isDown) {
			this.player.body.allowGravity = true;
		} else if (this.keys.up.isDown) {
			this.player.body.allowGravity = false;
			this.player.body.y = this.player.body.y -= .25;
		}
	}
}

function climbLadder() {
	// check to see if gamepad is connected
	if (this.input.gamepad.total !== 0) {
		if (this.axisV < 0 || this.pad.buttons[this.padConfig.UP].pressed) {
			this.player.body.allowGravity = false;
			this.player.body.y = this.player.body.y -= .25;
		} else if (this.axisH < 0 || this.pad.buttons[this.padConfig.LEFT].pressed || this.axisH > 0 || this.pad.buttons[this.padConfig.RIGHT].pressed) {
			this.player.body.allowGravity = true;
		} else if (this.axisV > 0 || this.pad.buttons[this.padConfig.DOWN].pressed) {
			this.player.body.allowGravity = false;
			this.player.body.y = this.player.body.y += .25;
		}
	} else {
		if (this.keys.up.isDown) {
			this.player.body.allowGravity = false;
			this.player.body.y = this.player.body.y -= .25;
		} else if (this.keys.left.isDown || this.keys.right.isDown) {
			this.player.body.allowGravity = true;
		} else if (this.keys.down.isDown && !this.player.body.blocked.down) {
			this.player.body.allowGravity = false;
			this.player.body.y = this.player.body.y += .25;
		}
	}
}

function hitEnemy() {
	this.player.x = 100;
	this.player.y = this.sys.game.config.height - 120;
}
