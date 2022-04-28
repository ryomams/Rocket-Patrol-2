
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload(){
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('rocket2', './assets/rocket2.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('spaceship2', './assets/spaceship2.png');
        this.load.image('starfield', './assets/spacefield.png');
        this.load.image('particle', './assets/the_sus.png');
        // load spritesheet for explosion
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }
    create() {
        this.add.text(20,20, "Rocket Patrol Playtime");
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0); 
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*3 + borderPadding*2, 'spaceship2', 0, 60, 4).setOrigin(0,0); 
        
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        //weapon = 0;
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        //init score
        this.p1Score = 0;
        // display score
        let scoreConfig = {
          fontFamily: 'Courier',
          fontSize: '28px',
          backgroundColor: '#F3B141',
          color: '#843605',
          align: 'right',
          padding: {
            top: 5,
            bottom: 5,
          },
          fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        //init GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            scoreConfig.fixedWidth = 0;
            this.add.text(game.config.width/2, game.config.height/2, 'FAILURE', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) or <- to FAIL AGAIN', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 128, 'YOU ARE A FAILURE', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        scoreConfig.fixedWidth = 100;
        //show the time elapsed!
        this.timeElapsed = 0 //probably dont need this variable but im keeping it because i dont want to think about a new solution
        this.timeRight = this.add.text(game.config.width - (borderUISize + borderPadding + scoreConfig.fixedWidth), borderUISize + borderPadding*2, this.timeElapsed, scoreConfig);

    }
    update() {
        //console.log(this.clock)
        //update the text for the timer
        this.timeElapsed = Math.trunc(this.clock.elapsed / 1000);
        this.timeRight.text = this.timeElapsed;

        if (this.clock.elapsed < 0) {this.clock.elapsed = 0}

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        //switch "weapons"
        if (Phaser.Input.Keyboard.JustDown(keyJ)) {
            weapon = !weapon;
            console.log(weapon);
            if (weapon) {
                this.p1Rocket = null;
            } else {
                this.p1Rocket = null;
            }
        }

        //move the starfield
        this.starfield.tilePositionX -= 4;
        //if the game isnt over, update all the shit
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        } 
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
          //console.log('kaboom ship 03');
          this.p1Rocket.reset();
          this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
          //console.log('kaboom ship 02');
          this.p1Rocket.reset();
          this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
          //console.log('kaboom ship 01');
          this.p1Rocket.reset();
          this.shipExplode(this.ship01);
        }
    }
    checkCollision(rocket, ship) {
        // simple AABB bounding box
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    shipExplode(ship) {
        //temporarily hide ship (OTP)
        ship.alpha = 0; //:flushed emoji:
        //create explosion sprite
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        this.sound.play('sfx_explosion');
        // score add and repaint
        this.p1Score += ship.points;
        this.clock.elapsed -= (ship.points/4) * 1000;
        //this.add.text(game.config.width/2, game.config.height/2 + 128, 'sample text here', scoreConfig).setOrigin(0.5);
        // this.time.delayedCall(300, () => {
        //}, null, this);
        this.scoreLeft.text = this.p1Score;     
    }
}
