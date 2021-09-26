class GamePlayScene extends Phaser.Scene {

    constructor () {
        super({ key: 'GamePlayScene' });
    }

    init() {
        console.log("GamePlayScene::init()")

        this.layers = {}
        this.texts = {}
        this.sprites = {}
        this.shapes = {}
        this.timers = {}
        this.counts = {}
        this.state = {}
        this.keys = {}

        this.theme = globals.colors.getTheme("default")

        globals.state = new GameState()

        this.counts.gameOver = 0
    }

    preload() {
        globals.animationFactory = new AnimationFactory(this)

        // Keys
        this.keys.arrowLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT, true, true)
        this.keys.arrowRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT, true, true)
        this.keys.arrowUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP, true, true)
        this.keys.arrowDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN, true, true)

        this.keys.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, true, true)
        this.keys.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, true, true)
        this.keys.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S, true, true)
        this.keys.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W, true, true)

        //
        console.log("Registering events")
        globals.emitter.on(Events.NEW_SURPRISE, this.showSurpriseModal, this)
        globals.emitter.on(Events.PAUSE, this.pause, this);
        globals.emitter.on(Events.UNPAUSE, this.unpause, this);
        globals.emitter.on(Events.QUIT, this.quit, this);
    }


    create() {
        console.log("GameScene::create()")
        this.cameras.main.setBackgroundColor(this.theme.background)

        this.layers.bottom = this.add.layer().setDepth(0)
        this.layers.dots = this.add.layer().setDepth(1)
        this.layers.missile = this.add.layer().setDepth(2)
        this.layers.player = this.add.layer().setDepth(3)
        this.layers.indicator = this.add.layer().setDepth(4)
        this.layers.pieces = this.add.layer().setDepth(5)
        this.layers.info = this.add.layer().setDepth(10)
        this.layers.surprise = this.add.layer().setDepth(20)

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

        this.texts.surpriseTime = this.add.bitmapText(coords.screenWidth - 15, coords.screenHeight + 5, FONT, "", 32)
            .setOrigin(0, 0)
            .setLetterSpacing(2)
            .setTint(this.theme.text.color)
            .setVisible(false)

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
        this.cameras.main.zoom = 10

        this.tweens.add({
            targets: this.cameras.main,
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

    pause() {
        this.scene.pause()
    }

    unpause() {
        this.scene.resume()
    }

    quit() {
        globals.state.forceGameOver()
        this.scene.pause()
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
        console.log(event.code)
        switch (event.code) {
            case "Digit1":
                globals.state.newSurprise()
                break
            case "Enter":
                globals.emitter.emit(Events.QUIT)
                break
            case "Backspace":
                globals.state.addNewPiece(this, this.layers.pieces)
                break
            case "Space":
                this.fireMissile()
                break
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

    updateInfo() {
        this.texts.score.setText("" + globals.state.score)
        this.texts.level.setText("LEVEL: " + globals.state.level)

        if (this.timers.levelTimer) {
            this.texts.time.setText("" + Math.ceil(this.timers.levelTimer.getRemainingSeconds()))
        }
        if (this.timers.surpriseTimer) {
            this.texts.surpriseTime.setText("" + Math.ceil(this.timers.surpriseTimer.getRemainingSeconds()))
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

    onSurpriseTimerEnd() {
        console.log("Surprise Timer End")
    }

    hideSurpriseModal() {
        this.state.showingSurpriseModal = false

        this.timers.levelTimer.paused = false
        this.timers.newPieceTimer.paused = false

        this.timers.surpriseTimer = this.time.addEvent({
            delay: globals.state.getLevelSeconds() * 1000,
            callback: this.onSurpriseTimerEnd,
            callbackScope: this
        });
    }

    surpriseTitleCallback(data) {
        // https://www.color-hex.com/color-palette/109407
        let colors = [0x00aed9, 0x53da3f, 0xffe71a, 0xff983a, 0x000000, 0xff17a3]

        data.color = colors[ data.index % colors.length ]

        let degrees = surpriseTitleCounter + data.index * 4
        degrees = degrees % 360

        let radians = degrees * Math.PI / 180.0
        data.scale = 1 + Math.sin(radians) * 0.01

        surpriseTitleCounter += 0.5;
        return data
    }

    surpriseSubTitleCallback(data) {

        let textTint = Phaser.Display.Color.HexStringToColor("#EEE434")

        let tints = []
        for (let i = 0; i < 10; i++) {
            tints.push(textTint)
            textTint = textTint.clone().brighten(2)
        }
        for (let i = 0; i < 10; i++) {
            tints.push(textTint)
            textTint = textTint.clone().darken(2)
        }

        let index = Math.floor((surpriseSubTitleCounter / 100) % tints.length)
        data.color = tints[index].color

        surpriseSubTitleCounter++

        return data
    }


    showSurpriseModal() {
        this.state.showingSurpriseModal = true

        this.timers.levelTimer.paused = true
        this.timers.newPieceTimer.paused = true

        if (this.timers.surpriseTimer) {
            this.timers.surpriseTimer.destroy()
        }

        let rectBackground = this.add.rectangle(
            0,
            0,
            globals.coords.screenWidth,
            globals.coords.screenHeight,
            0x000000)
            .setOrigin(0, 0)
            .setAlpha(0.80)


        let sprite = globals.state.surprise.buildSprite(this)
            sprite.setOrigin(0, 0)

        let textTitle = this.add.dynamicBitmapText(0, 0, 'kanit-64-semibold', globals.state.surprise.getTitle().toUpperCase(), 64)
            .setOrigin(0, 0)
            .setDisplayCallback(this.surpriseTitleCallback);

        let textSubTitle = this.add.dynamicBitmapText(0, 0, 'kanit-64-semibold', globals.state.surprise.getSubTitle().toUpperCase(), 24)
            .setOrigin(0, 1)
            .setDisplayCallback(this.surpriseSubTitleCallback);

        let modalMargin = 40

        let modalWidth = sprite.displayWidth + Math.max(textTitle.width, textSubTitle.width) + modalMargin * 3
        let modalHeight = sprite.displayHeight + modalMargin * 2

        let modalX = globals.coords.screenWidth / 2 - modalWidth / 2
        let modalY = globals.coords.screenHeight / 2 - modalHeight / 2

        let rectModal = this.add.rectangle(
            modalX,
            modalY,
            modalWidth,
            modalHeight)
            .setFillStyle(0x000000, 1)
            .setOrigin(0, 0)
            .setStrokeStyle(2, 0xff0000, 1)

        sprite.setPosition(modalX + modalMargin, modalY + modalMargin)

        let textX = modalX + modalMargin + sprite.displayWidth + modalMargin
        textTitle.setPosition(textX, modalY + modalMargin - 20)
        textSubTitle.setPosition(textX, modalY + modalMargin + sprite.displayHeight + 5)

        this.layers.surprise.add([rectBackground, rectModal, sprite, textTitle, textSubTitle])

        this.layers.surprise.setAlpha(0)
        this.tweens.add({
            targets: this.layers.surprise,
            alpha: 1,
            duration: 500,
            ease: 'Back',
            easeParams: [ 1 ],
        })

        this.tweens.add({
            targets: [rectBackground, rectModal, textTitle, textSubTitle],
            alpha: 0,
            delay: 3000,
            duration: 500,
            ease: 'Back',
            easeParams: [ 1 ],
        })

        this.tweens.add({
            targets: sprite,
            x: 10,
            y: globals.coords.screenHeight - 100 - 10,
            scale: 100 / sprite.displayHeight,
            delay: 3000,
            duration: 500,
            ease: 'Back',
            easeParams: [ 1 ],
            onComplete: this.surpriseSpriteMoveEnd,
            onCompleteScope: this,
            onCompleteParams: sprite
        })

    }

    surpriseSpriteMoveEnd(tween, targets, sprite) {
        this.sprites.surprise = sprite
        this.layers.surprise.remove(sprite)
        this.layers.info.add(sprite)

        // destroy all children in the surprise modal
        let children = this.layers.surprise.getChildren()
        for (let i = 0; i < children.length; i++) {
            let child = children[i]
            this.layers.surprise.remove(child)
            child.destroy()
        }

        // set the surprise timer
        this.timers.surpriseTimer = this.time.addEvent({
            delay: globals.state.surprise.getLengthSeconds() * 1000,
            callback: this.onSurpriseTimerEnd,
            callbackScope: this
        });

        this.texts.surpriseTime.setPosition(sprite.x + sprite.displayWidth, sprite.y)
        this.texts.surpriseTime.setVisible(true)

        this.timers.levelTimer.paused = false
        this.timers.newPieceTimer.paused = false
    }

    onSurpriseTimerEnd() {
        this.texts.surpriseTime.setVisible(false)

        if (this.timers.surpriseTimer) {
            this.timers.surpriseTimer.destroy()
        }

        if (this.sprites.surprise) {
            this.layers.info.remove(this.sprites.surprise)
            this.sprites.surprise.destroy()
        }

        globals.state.surprise = null
    }

    update() {
        // if the game is over (then there is nothing to update)
        if (this.counts.gameOver > 0) {
            return
        }

        this.updateInfo()

        if ((this.keys.arrowLeft.isDown) || (this.keys.keyA.isDown)) {
            globals.state.player.move(Direction.LEFT, -1, 0)
        }
        if ((this.keys.arrowRight.isDown) || (this.keys.keyD.isDown)) {
            globals.state.player.move(Direction.RIGHT, 1, 0)
        }
        if ((this.keys.arrowUp.isDown) || (this.keys.keyW.isDown)) {
            globals.state.player.move(Direction.UP, 0, -1)
        }
        if ((this.keys.arrowDown.isDown) || (this.keys.keyS.isDown)) {
            globals.state.player.move(Direction.DOWN, 0, 1)
        }


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
