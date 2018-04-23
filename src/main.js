import 'phaser';

let config = {
	type: Phaser.AUTO,
	parent: 'content',
	width: 800,
	height: 600,
	scaleMode: 0, //Phaser.ScaleManager.EXACT_FIT,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 500 },
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

function preload() {
	this.load.image('sky', 'assets/sky.png');
	this.load.image('ground', 'assets/platform.png');
	this.load.image('star', 'assets/star.png');
	this.load.image('bomb', 'assets/bomb.png');
	this.load.spritesheet('dude', 'assets/sky.png',
		{ frameWidth: 32, frameHeight: 48 }
	);
}

function create() {
	this.add.image(0, 0, 'sky').setOrigin(0, 0);
}

function update() {

}
