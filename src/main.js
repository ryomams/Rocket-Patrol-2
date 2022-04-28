console.log("peepee")

//configurationinator
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    parent: "gamegohere",
    scene: [Menu, Play],
    pixelArt: true,
}

// let there be light!
let game = new Phaser.Game(config);

//Set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars (ok but why tho)
let keyJ, keyF, keyR, keyLEFT, keyRIGHT;

let weapon = false;
let mode = 0;




