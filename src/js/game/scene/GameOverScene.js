class GameOverScene extends Phaser.Scene {

    constructor () {
        super({ key: 'GameOverScene' });
    }

    init() {
        console.log("GameOverScene::init()")

        this.rects = {}
        this.texts = {}
        this.state = {}

        globals.gameOverScene = {}
        globals.gameOverScene.rainbowWave = 0
    }

    preload() {
        globals.emitter.on(Events.QUIT, this.showGameOver, this);
        globals.emitter.on(Events.GAME_OVER, this.showGameOver, this);
    }


    create () {
        console.log("GameOverScene::create()")

        let width = globals.coords.screenWidth
        let height = globals.coords.screenHeight

        this.components = {}

        this.components.rect = this.add.rectangle(0, 0, width, height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(0.85)
            .setVisible(false)

        const FONT = 'kanit-96-glow'
        this.components.textGameOver = this.add.dynamicBitmapText(width / 2, 0 - height, FONT, "GAME OVER", 96)
            .setOrigin(0.5, 0.5)
            .setDisplayCallback(this.gameOverTextCallback)
            .setVisible(false)


        this.components.textScore = this.add.bitmapText(width / 2, height + height, FONT, "", 48)
            .setOrigin(0.5, 0.5)
            .setVisible(false)

        // Input
        this.input.keyboard.on('keydown', this.keyDown, this)
        this.input.on('pointerdown', this.pointerDown, this);
    }

    keyDown(event) {
        if (this.state.active) {
            globals.emitter.emit(Events.GAME_DONE)
        }
    }

    pointerDown(event) {
        if (this.state.active) {
            globals.emitter.emit(Events.GAME_DONE)
        }
    }

    showGameOver() {
        globals.music.play("cool-puzzler")

        this.components.textScore.setText("SCORE: " + globals.state.score)

        this.components.rect.setVisible(true)
        this.components.textGameOver.setVisible(true)
        this.components.textScore.setVisible(true)

        this.tweens.add({
            targets: this.components.textGameOver,
            y: globals.coords.getScreenFractionY(0.35),
            duration: 1000,
            ease: 'Back',
            easeParams: [ 0.5 ]
        })

        this.tweens.add({
            targets: this.components.textScore,
            y: globals.coords.getScreenFractionY(0.55),
            duration: 1000,
            ease: 'Back',
            easeParams: [ 0.5 ],
            onComplete: function() {
                this.state.active = true
            },
            onCompleteScope: this
        })
    }

    gameOverTextCallback(data) {
        // https://www.color-hex.com/color-palette/109407
        let colors = [0x00aed9, 0x53da3f, 0xffe71a, 0xff983a, 0x000000, 0xff17a3]

        data.color = colors[ data.index % colors.length ]

        let degrees = globals.gameOverScene.rainbowWave + data.index * 15
        degrees = degrees % 360

        let radians = degrees * Math.PI / 180.0
        data.y = data.y + Math.sin(radians) * 5;

        globals.gameOverScene.rainbowWave += 1;
        return data
    }

}
