let rainbowWave = 0

class GameScene extends Phaser.Scene {

    constructor () {
        super({ key: 'GameScene' });
    }

    init() {
        console.log("GameScene::init()")

        this.layers = {}
        this.texts = {}
        this.sprites = {}
        this.shapes = {}
        this.timers = {}
        this.counts = {}
        this.state = {}

        this.theme = globals.colors.getTheme("default")

        globals.state = new GameState()

        this.counts.gameOver = 0
    }

    preload() {
        globals.animationFactory = new AnimationFactory(this)
    }


    create () {

        let camera = this.cameras.main
            camera.setBackgroundColor(this.theme.background)

        this.layers.bottom = this.add.layer().setDepth(0)
        this.layers.dots = this.add.layer().setDepth(1)
        this.layers.missile = this.add.layer().setDepth(2)
        this.layers.player = this.add.layer().setDepth(3)
        this.layers.indicator = this.add.layer().setDepth(4)
        this.layers.pieces = this.add.layer().setDepth(5)
        this.layers.info = this.add.layer().setDepth(10)

        let coords = globals.coords

        // Info Layer
        const FONT = 'kanit-64-semibold'
        //const FONT = 'game-font'
        this.texts.score = this.add.bitmapText(10, 80, FONT, "", 64)
            .setOrigin(0, 1)
            .setLetterSpacing(2)
            .setTint(this.theme.text.color)

        this.texts.level = this.add.bitmapText(coords.screenWidth - 15, 80, FONT, "", 64)
            .setOrigin(1, 1)
            .setLetterSpacing(4)
            .setTint(this.theme.text.color)

        this.texts.time = this.add.bitmapText(coords.screenWidth - 15, coords.screenHeight + 5, FONT, "", 64)
            .setOrigin(1, 1)
            .setLetterSpacing(2)
            .setTint(this.theme.text.color)

        this.layers.info.add([this.texts.score, this.texts.level, this.texts.time])


        // Bottom Layer
        let playerRectBox1 = this.add.rectangle(
            coords.screenWidth / 2 - coords.boardXUnits(1),
            coords.screenHeight / 2 - coords.boardYUnits(1),
            coords.boardXUnits(2),
            coords.boardYUnits(2),
            this.theme.pit1.color)
            .setOrigin(0.5, 0.5)

        let playerRectBox2 = this.add.rectangle(
            coords.screenWidth / 2 + coords.boardXUnits(1),
            coords.screenHeight / 2 - coords.boardYUnits(1),
            coords.boardXUnits(2),
            coords.boardYUnits(2),
            this.theme.pit2.color)
            .setOrigin(0.5, 0.5)

        let playerRectBox3 = this.add.rectangle(
            coords.screenWidth / 2 - coords.boardXUnits(1),
            coords.screenHeight / 2 + coords.boardYUnits(1),
            coords.boardXUnits(2),
            coords.boardYUnits(2),
            this.theme.pit3.color)
            .setOrigin(0.5, 0.5)

        let playerRectBox4 = this.add.rectangle(
            coords.screenWidth / 2 + coords.boardXUnits(1),
            coords.screenHeight / 2 + coords.boardYUnits(1),
            coords.boardXUnits(2),
            coords.boardYUnits(2),
            this.theme.pit4.color)
            .setOrigin(0.5, 0.5)

        this.layers.bottom.add(playerRectBox1, playerRectBox2, playerRectBox3, playerRectBox4)


        // Dots Layer
        for (let x = 0; x < globals.state.BOARD_WIDTH; x++) {
            for (let y = 5; y < 9; y++) {
                let dot = this.add.circle(
                    coords.boardXToScreenX(x),
                    coords.boardYToScreenY(y),
                    2,
                    this.theme.dots.color)
                    .setOrigin(0.5, 0.5)
                this.layers.dots.add(dot)
            }
        }

        for (let x = 8; x < 12; x++) {
            for (let y = 0; y < globals.state.BOARD_HEIGHT; y++) {
                let dot = this.add.circle(
                    coords.boardXToScreenX(x),
                    coords.boardYToScreenY(y),
                    2,
                    this.theme.dots.color)
                    .setOrigin(0.5, 0.5)
                this.layers.dots.add(dot)
            }
        }

        // Player Layer
        globals.state.player.buildSprite(this, this.layers.player)

        // Missile Layer
        globals.state.missile.buildSprite(this, this.layers.missile)

        // Next Piece Indicator
        globals.state.nextPieceIndicator.buildSprite(this, this.layers.indicator)
        globals.state.initNextPiece()

        // Camera Zoom in effect
        console.log(camera.zoom)
        camera.zoom = 10

        this.tweens.add({
            targets: camera,
            zoom: 1,
            duration: 1000,
            ease: 'Back',
            easeParams: [ 1 ],
        })


        // Events
        this.input.on('pointerdown', this.click, this);

        this.input.keyboard.on('keydown', this.keyDown, this);

        // Music
        globals.music.play("desert-mayhem")

        this.initLevelTimer()
        this.initNewPieceTimer()
    }

    togglePause() {
        let state = globals.state
        state.togglePaused()

        if (globals.state.paused) {
            this.timers.levelTimer.paused = true
            this.timers.newPieceTimer.paused = true
            this.layers.modal = this.add.layer().setDepth(1000)
            this.layers.modal.setAlpha(0.85)
            this.layers.modal.setVisible(true)

            let camera = this.cameras.main
            let width = camera.width
            let height = camera.height

            let rect = this.add.rectangle(
                0,
                0,
                globals.coords.screenWidth,
                globals.coords.screenHeight,
                0x000000)
                .setOrigin(0, 0)
                .setAlpha(0.80)

            let text1 = this.add.bitmapText(width / 2, height * 0.40, 'game-font', 'Game Paused', 64)
                .setOrigin(0.5, 0.5)

            let text2 = this.add.bitmapText(width / 2, height * 0.55, 'game-font', 'Press Esc to resume', 24)
                .setOrigin(0.5, 0.5)

            let text3 = this.add.bitmapText(width / 2, height * 0.62, 'game-font', 'Press Q to quit', 24)
                .setOrigin(0.5, 0.5)

            this.layers.modal.add([rect, text1, text2, text3])
        }
        else {
            this.timers.levelTimer.paused = false
            this.timers.newPieceTimer.paused = false
            this.layers.modal.destroy()
            this.layers.modal = null
        }
    }

    quit() {
        this.scene.start('TitleScene')
    }

    fireMissile() {
        let state = globals.state

        // if we are already firing, do nothing
        if (state.missile.firing) {
            return
        }

        // fire the missile and compute it's end point
        let firingInfo = state.fireMissile()

        // get the end state
        state.missile.fire(
            state.player.x,
            state.player.y,
            firingInfo.endPos.x,
            firingInfo.endPos.y,
            firingInfo.startColor,
            firingInfo.endColor,
            firingInfo.explodingPieces,
            firingInfo.pieceToChange
        )
    }

    keyDown(event) {
        if (this.state.gameOverInputAllowed) {
            this.nextScene()
            return
        }

        if (globals.state.paused) {
            switch (event.code) {
                case "Escape":
                    this.togglePause();
                    break;
                case "KeyQ":
                    console.log("QUITTTING!")
                    this.quit();
                    break;
            }
            return;
        }

        console.log(event.code)
        switch (event.code) {
            case "Enter":
                globals.state.forceGameOver()
                globals.state.forcePaused()
                break
            case "ArrowLeft":
                globals.state.player.move(Direction.LEFT, -1, 0)
                break
            case "KeyA":
                globals.state.player.move(Direction.LEFT, -1, 0)
                break
            case "ArrowRight":
                globals.state.player.move(Direction.RIGHT, 1, 0)
                break
            case "KeyD":
                globals.state.player.move(Direction.RIGHT, 1, 0)
                break
            case "ArrowUp":
                globals.state.player.move(Direction.UP, 0, -1)
                break
            case "KeyW":
                globals.state.player.move(Direction.UP, 0, -1)
                break
            case "ArrowDown":
                globals.state.player.move(Direction.DOWN, 0, 1)
                break
            case "KeyS":
                globals.state.player.move(Direction.DOWN, 0, 1)
                break
            case "Backspace":
                globals.state.addNewPiece(this, this.layers.pieces)
                break
            case "Space":
                this.fireMissile()
                break
            case "Escape":
                this.togglePause();
                break;
        }
    }

    click() {
        if (this.state.gameOverInputAllowed) {
            this.nextScene()
            return
        }
        if (this.counts.gameOver > 0) {
            return
        }

        globals.state.addNewPiece(this, this.layers.pieces)
    }

    onPieceMove(piece, scene) {
        let boardPos = piece.getBoardPos()
        let newBoardPos = piece.getNewBoardPosition()

        let screenPosX = scene.logicalToScreenX(boardPos.x)
        let screenPosY = scene.logicalToScreenX(boardPos.y)
        piece.sprite.setPosition(screenPosX, screenPosY)

        let newScreenPosX = scene.logicalToScreenX(newBoardPos.x)
        let newScreenPosY = scene.logicalToScreenX(newBoardPos.y)

        scene.tweens.add({
            targets: piece.sprite,
            x: newScreenPosX,
            y: newScreenPosY,
            duration: 1000
        });
    }

    pause() {
        this.layers.modal = this.add.layer().setDepth(1000)
        this.layers.modal.setAlpha(0.85)
        this.layers.modal.setVisible(true)

        let camera = this.cameras.main
        let width = camera.width
        let height = camera.height

        let rect = this.add.rectangle(width / 2, height / 2, width *.60, height * .40, 0x000000)
            .setOrigin(0.5, 0.5)

        let text1 = this.add.bitmapText(width / 2, height * 0.40, 'game-font', 'Game Paused', 36)
            .setOrigin(0.5, 0.5)

        let text2 = this.add.bitmapText(width / 2, height * 0.55, 'game-font', 'Press [Esc] to resume', 24)
            .setOrigin(0.5, 0.5)

        let text3 = this.add.bitmapText(width / 2, height * 0.62, 'game-font', 'Press [q] to quit', 24)
            .setOrigin(0.5, 0.5)

        this.layers.modal.add([rect, text1, text2, text3])

    }

    updateInfo() {
        this.texts.score.setText("" + globals.state.score)
        this.texts.level.setText("LEVEL: " + globals.state.level)

        if (this.timers.levelTimer) {
            this.texts.time.setText("" + Math.ceil(this.timers.levelTimer.getRemainingSeconds()))
        }
    }


    initLevelTimer() {
        if (this.timers.levelTimer) {
            this.timers.levelTimer.destroy()
        }
        this.timers.levelTimer = this.time.addEvent({
            delay: globals.state.getLevelSeconds() * 1000,
            callback: this.onLevelTimerEnd,
            callbackScope: this
        });

    }

    onLevelTimerEnd() {
        globals.state.levelUp()

        this.initNewPieceTimer()
        this.initLevelTimer()
    }

    newPiece() {
        globals.state.addNewPiece(this, this.layers.pieces)
    }

    initNewPieceTimer() {
        if (this.timers.newPieceTimer) {
            this.timers.newPieceTimer.destroy()
        }
        this.timers.newPieceTimer = this.time.addEvent({
            delay: globals.state.getNewPieceSeconds() * 1000,
            callback: this.newPiece,
            loop: true,
            callbackScope: this
        });
    }

    gameOver() {
        globals.music.play("cool-puzzler")

        globals.state.forcePaused()

        this.layers.gameOver = this.add.layer().setDepth(2000)
        this.layers.gameOver.setVisible(true)

        let width = globals.coords.screenWidth
        let height = globals.coords.screenHeight

        let rect = this.add.rectangle(
            0,
            0,
            globals.coords.screenWidth,
            globals.coords.screenHeight,
            0x000000)
            .setOrigin(0, 0)
            .setAlpha(0.85)

        const FONT = 'kanit-96-glow'
        let text1 = this.add.dynamicBitmapText(width / 2, 0 - height, FONT, "GAME OVER", 96)
            .setOrigin(0.5, 0.5)
            .setDisplayCallback(this.gameOverTextCallback);

        this.tweens.add({
            targets: text1,
            y: height * 0.35,
            duration: 1000,
            ease: 'Back',
            easeParams: [ 0.5 ]
        })

        let text2 = this.add.bitmapText(width / 2, height + height, FONT, "SCORE:  " + globals.state.score, 48)
            .setOrigin(0.5, 0.5)

        this.tweens.add({
            targets: text2,
            y: height * 0.55,
            duration: 1000,
            ease: 'Back',
            easeParams: [ 0.5 ],
            onComplete: function() {
                this.state.gameOverInputAllowed = true
            },
            onCompleteScope: this
        })

        this.layers.gameOver.add([rect, text1, text2])
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

    nextScene() {
        this.scene.start('NewHighScoreScene')
    }

    update() {
        // if the game is over (then there is nothing to update)
        if (this.counts.gameOver > 0) {
            return
        }

        this.updateInfo()

        if (globals.state.isGameOver()) {
            if (this.counts.gameOver == 0) {
                this.gameOver()
            }
            this.counts.gameOver++
        }

        if (globals.state.missile) {
            globals.state.missile.update()
        }
    }

}
