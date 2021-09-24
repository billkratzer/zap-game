class GameScene extends Phaser.Scene {

    constructor () {
        super({ key: 'GameScene' });
    }

    init() {
        console.log("GameScene::init()")

        globals.state = new GameState()
    }

    preload() {
        console.log("GameScene::preload()")

        globals.animationFactory = new AnimationFactory(this)
    }

    create () {
    }

    update() {
    }

}
