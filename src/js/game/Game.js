var config = {
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,
    pixelArt: true,
    parent: "game",
    scene: [ SplashScene, BootScene, TitleScene, GameScene, NewHighScoreScene, HighScoreScene, TestScene ],
    audio: {
        disableWebAudio: true
    }
};

var game = new Phaser.Game(config);

var globals = {
    gameState: null,
    version: '0.1'
}
