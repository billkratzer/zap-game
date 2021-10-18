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

        globals.emitter.on(Events.GAME_DONE, this.nextScene, this)
    }

    create () {
        this.scene.launch('GameInfoScene')
        this.scene.launch('GamePlayScene')
        this.scene.launch('GamePausedScene')
        this.scene.launch('GameOverScene')

        this.scene.bringToTop('GamePlayScene')
        this.scene.bringToTop('GameInfoScene')
        this.scene.bringToTop('GamePausedScene')
        this.scene.bringToTop('GameOverScene')

        // Input
        this.input.keyboard.on('keydown', this.keyDown, this)
    }

    keyDown(event) {
        switch (event.code) {
            case "Escape":
                if (!globals.state.isGameOver()) {
                    this.togglePause()
                }
                break;
        }
    }

    togglePause() {
        globals.state.togglePaused()

        if (globals.state.paused) {
            globals.emitter.emit(Events.PAUSE)
        }
        else {
            globals.emitter.emit(Events.UNPAUSE)
        }
    }

    nextScene() {
        this.scene.stop('GamePlayScene')
        this.scene.stop('GamePausedScene')
        this.scene.stop('GameOverScene')
        this.scene.stop('GameInfoScene')

        this.scene.start('NewHighScoreScene');
    }

    update() {
    }

}
