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

var bombs;
var score = 0;
var scoreText;
var stars;

function preload() {
	this.load.image('sky', 'assets/sky.png');
	this.load.image('ground', 'assets/platform.png');
	this.load.image('star', 'assets/star.png');
	this.load.image('bomb', 'assets/bomb.png');
	this.load.spritesheet('ninjaCat', 'assets/cat.png',
		{ frameWidth: 32, frameHeight: 48 }
	);
	this.load.spritesheet('blueSpikey', 'assets/blue_guy.png',
		{ frameWidth: 32, frameHeight: 32}
	);

	this.load.image('outside_tiles', 'assets/outside_tiles.png');
	this.load.tilemapTiledJSON('map', 'assets/test_tilemap.json');
}

function create() {
	//tile tilemapTiledJSONthis.map = this.add.tilemap('level1');
	this.map = this.add.tilemap('map');
	var tileset = this.map.addTilesetImage('outside_tiles','outside_tiles');
	this.skyLayer = this.map.createStaticLayer('sky', tileset);
	this.backgroundLayer = this.map.createStaticLayer('background', tileset);
	this.platformLayer = this.map.createStaticLayer('ladder', tileset);
	this.platform_edges = this.map.createStaticLayer('platform_edge', tileset);
	this.platformLayer = this.map.createStaticLayer('ground', tileset);
	this.platform_edges.setCollision([169], true);
	this.platformLayer.setCollision([174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 237, 238, 304, 305, 306, 307, 308, 309], true);

	//set up scoring
	scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});

	// create blue Blue Spikey
	let enemyPosision = [{x: 608, y: 64}, {x: 128, y: 240}, {x: 512, y: 336}, {x: 512, y: 512}];
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

	// star objects
	stars = this.physics.add.group({
		key: 'star',
		repeat: 11,
		setXY: { x: 12, y: 200, stepX: 70 }
	});

	// bomb objects
	bombs = this.physics.add.group();

	// set collision/overlap detection
	this.physics.add.collider(stars, this.platformLayer);
	this.physics.add.overlap(this.player, stars, collectStar, null, this);
	this.physics.add.collider(this.player, this.platformLayer);
	this.physics.add.collider(this.enemyGroup, this.platformLayer);
	this.physics.add.collider(this.enemyGroup, this.platform_edges);
	this.physics.add.collider(bombs, this.platformLayer);
	this.physics.add.collider(this.player, bombs, hitBomb, null, this);

	// set user controlls
	this.keys = {
		reset: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
		jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
		left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
		right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
	};
	// set up gamepad config
	this.padConfig = Phaser.Input.Gamepad.Configs.XBOX_360;
}

function update() {
	this.player.update(this.padConfig, this.keys);
	this.enemyGroup.children.entries.forEach((enemy) => {
		enemy.update();
	});
	// this.blueSpikey.update();
}

function collectStar(player, star) {
	star.disableBody(true, true);
	score += 1;
	scoreText.setText(`Score: ${score}`);
	releaseBomb();
}

function hitBomb(player) {
	this.physics.pause();
	player.setTint(0xFF0000);
	player.anims.play('turn');
	this.scene.start;
}

function releaseBomb() {
	if (stars.countActive(true) === 0) {
		stars.children.iterate((child) => {
			child.enableBody(true, child.x, 0, true, true);
		});

		let x = (this.player.x < 400) ? Phaser.Math.Between(401, 775) : Phaser.Math.Between(25, 400);
		let y = (this.player.y < 300) ? Phaser.Math.Between(251, 500) : Phaser.Math.Between(0, 250);
		let bombs = bombs.create(x, y, 'bomb').setScale(3);
		bombs.setCollideWorldBounds(true);
		bombs.setBounceY(1);
		bombs.allowGravity = true;
	}
}
