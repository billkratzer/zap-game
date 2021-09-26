let rainbowWave = 0
let surpriseTitleCounter = 0
let surpriseSubTitleCounter = 0

class GameOverScene extends Phaser.Scene {

    constructor () {
        super({ key: 'GameOverScene' });
    }

    init() {
        console.log("GameOverScene::init()")

        this.rects = {}
        this.texts = {}
        this.state = {}
    }

    preload() {
        globals.emitter.on(Events.QUIT, this.showGameOver, this);
        globals.emitter.on(Events.GAME_OVER, this.showGameOver, this);
    }


    create () {
        console.log("GameOverScene::create()")

        this.rects.background = this.add.rectangle(
            0,
            0,
            globals.coords.screenWidth,
            globals.coords.screenHeight,
            0x000000)
            .setOrigin(0, 0)
            .setAlpha(0.85)
            .setVisible(false)

        let width = globals.coords.screenWidth
        let height = globals.coords.screenHeight

        const FONT = 'kanit-96-glow'
        this.texts.gameOver = this.add.dynamicBitmapText(width / 2, 0 - height, FONT, "GAME OVER", 96)
            .setOrigin(0.5, 0.5)
            .setDisplayCallback(this.gameOverTextCallback)
            .setVisible(false)


        this.texts.score = this.add.bitmapText(width / 2, height + height, FONT, "SCORE:  " + globals.state.score, 48)
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

        this.rects.background.setVisible(true)
        this.texts.gameOver.setVisible(true)
        this.texts.score.setVisible(true)

        this.tweens.add({
            targets: this.texts.gameOver,
            y: globals.coords.getScreenFractionY(0.35),
            duration: 1000,
            ease: 'Back',
            easeParams: [ 0.5 ]
        })

        this.tweens.add({
            targets: this.texts.score,
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

        let degrees = rainbowWave + data.index * 15
        degrees = degrees % 360

        let radians = degrees * Math.PI / 180.0
        data.y = data.y + Math.sin(radians) * 5;

        rainbowWave += 1;
        return data
    }

}
