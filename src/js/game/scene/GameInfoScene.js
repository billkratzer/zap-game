class GameInfoScene extends Phaser.Scene {

    constructor () {
        super({ key: 'GameInfoScene' });
    }

    init() {
        console.log("GameInfoScene::init()")

        this.components = {}

        this.theme = globals.colors.getTheme("default")
    }

    preload() {
        globals.emitter.on(Events.UPDATE_SCORE, this.updateScore, this)
        globals.emitter.on(Events.UPDATE_LEVEL, this.updateLevel, this);

        globals.emitter.on(Events.NEW_LEVEL_TIMER, this.newLevelTimer, this);
        globals.emitter.on(Events.NEW_SURPRISE_TIMER, this.newSurpriseTimer, this);
    }


    create() {
        console.log("GameInfoScene::create()")

        let coords = globals.coords

        // Info Layer
        const FONT = 'kanit-64-semibold'
        //const FONT = 'game-font'
        this.components.textScore = this.add.bitmapText(10, 80, FONT, "", 64)
            .setOrigin(0, 1)
            .setLetterSpacing(2)
            .setTint(this.theme.text.color)

        this.components.textLevel = this.add.bitmapText(coords.screenWidth - 15, 80, FONT, "", 64)
            .setOrigin(1, 1)
            .setLetterSpacing(4)
            .setTint(this.theme.text.color)

        this.components.textLevelTime = this.add.bitmapText(coords.screenWidth - 15, coords.screenHeight + 5, FONT, "", 64)
            .setOrigin(1, 1)
            .setLetterSpacing(2)
            .setTint(this.theme.text.color)

        this.components.textSurpriseTime = this.add.bitmapText(coords.screenWidth - 15, coords.screenHeight + 5, FONT, "", 32)
            .setOrigin(0, 0)
            .setLetterSpacing(2)
            .setTint(this.theme.text.color)
            .setVisible(false)

        
        this.updateScore(globals.state.score)
        this.updateLevel(globals.state.level)
    }

    updateScore(score) {
        this.components.textScore.setText("" + score)
    }

    updateLevel(level) {
        this.components.textLevel.setText("LEVEL: " + level)
    }

    newLevelTimer(timer) {
        this.components.levelTimer = timer
    }

    newSurpriseTimer(timer) {
        this.components.surpriseTimer = timer
    }

    update() {
        if (this.components.levelTimer) {
            this.components.textLevelTime.setText(
                "" + Math.ceil(this.components.levelTimer.getRemainingSeconds())
            )
        }
        if (this.components.surpriseTimer) {
            this.components.textSurpriseTime.setText(
                "" + Math.ceil(this.components.surpriseTimer.getRemainingSeconds())
            )
        }
    }

}
