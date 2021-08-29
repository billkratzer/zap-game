class GameScene extends Phaser.Scene {


    constructor () {
        super({ key: 'GameScene' });

        this.layers = {}
        this.texts = {}
        this.sprites = {}
        this.shapes = {}
        this.timers = {}

        this.counts = {}
    }

    preload () {
        globals.state = new GameState()
        globals.animationFactory = new AnimationFactory(this)

        this.counts.gameOver = 0
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

    create () {
        let camera = this.cameras.main
        camera.setBackgroundColor("#333")

        globals.coords = new ScreenCoords(camera.width, camera.height, globals.state.BOARD_WIDTH, globals.state.BOARD_HEIGHT)

        this.layers.bottom = this.add.layer().setDepth(0)
        this.layers.dots = this.add.layer().setDepth(1)
        this.layers.missile = this.add.layer().setDepth(2)
        this.layers.player = this.add.layer().setDepth(3)
        this.layers.pieces = this.add.layer().setDepth(4)
        this.layers.info = this.add.layer().setDepth(10)


        // Info Layer
        this.texts.score = this.add.bitmapText(
            0 + 10,
            0,
            'game-font',
            ' ',
            64)
            .setOrigin(0, 0)

        this.texts.level = this.add.bitmapText(
            globals.coords.screenWidth - 10,
            0,
            'game-font',
            'Level: ',
            64)
            .setOrigin(1, 0)

        this.texts.time = this.add.bitmapText(
            globals.coords.screenWidth - 10,
            globals.coords.screenHeight - 10,
            'game-font',
            'Time: ',
            64)
            .setOrigin(1, 1)

        this.layers.info.add([this.texts.score, this.texts.level, this.texts.time])


        // Bottom Layer
        let playerRectBox = this.add.rectangle(
            globals.coords.getScreenMiddleX(),
            globals.coords.getScreenMiddleY(),
            globals.coords.boardXUnits(4),
            globals.coords.boardYUnits(4),
            0xff0000)
            .setOrigin(0.5, 0.5)
        this.layers.bottom.add(playerRectBox)


        // Dots Layer
        for (let x = 0; x < globals.state.BOARD_WIDTH; x++) {
            for (let y = 5; y < 9; y++) {
                let dot = this.add.circle(
                    globals.coords.boardXToScreenX(x),
                    globals.coords.boardYToScreenY(y),
                    2,
                    0xffffff)
                    .setOrigin(0.5, 0.5)
                this.layers.dots.add(dot)
            }
        }

        for (let x = 8; x < 12; x++) {
            for (let y = 0; y < globals.state.BOARD_HEIGHT; y++) {
                let dot = this.add.circle(
                    globals.coords.boardXToScreenX(x),
                    globals.coords.boardYToScreenY(y),
                    2,
                    0xffffff)
                    .setOrigin(0.5, 0.5)
                this.layers.dots.add(dot)
            }
        }

        // Player Layer
        globals.state.player.buildSprite(this, this.layers.player)

        // Missile Layer
        globals.state.missile.buildSprite(this, this.layers.missile)


        // Events

        this.input.on('pointerdown', this.click, this);

        this.input.keyboard.on('keydown', function (event) {
            this.keyDown(event.code);

        }, this);


        this.initLevelTimer()
        this.initNewPieceTimer()
    }

    fireMissile() {
        let state = globals.state

        // if we are already firing, do nothing
        if (state.missile.firing) {
            console.log("Already Firing!!!!!")
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

    keyDown(code) {
        console.log(code)
        if (globals.state.isGameOver()) {
            switch (code) {
                case "Escape":
                    this.scene.start('TitleScene');
                    break;
                case "Space":
                    this.scene.start('TitleScene');
                    break;
            }
            return
        }

        if (globals.state.paused) {
            switch (code) {
                case "Escape":
                    this.togglePause();
                    break;
                case "KeyQ":
                    if (globals.state.paused) {
                        this.quit();
                    }
                    break;
            }
            return;
        }

        switch (code) {
            case "ArrowLeft":
                globals.state.player.move(Direction.LEFT, -1, 0)
                break
            case "ArrowRight":
                globals.state.player.move(Direction.RIGHT, 1, 0)
                break
            case "ArrowUp":
                globals.state.player.move(Direction.UP, 0, -1)
                break
            case "ArrowDown":
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

    click(pointer, localX, localY, event) {
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
        this.texts.level.setText("Level: " + globals.state.level)

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
        this.layers.gameOver = this.add.layer().setDepth(2000)
        this.layers.gameOver.setVisible(true)

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
            .setAlpha(0.85)

        let text1 = this.add.bitmapText(width / 2, height * 0.40, 'game-over-font', 'GAME OVER', 96)
            .setOrigin(0.5, 0.5)

        let text2 = this.add.bitmapText(width / 2, height * 0.55, 'game-font', 'Press [Space] to quit', 24)
            .setOrigin(0.5, 0.5)

        this.layers.gameOver.add([rect, text1, text2])
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
    }

}
