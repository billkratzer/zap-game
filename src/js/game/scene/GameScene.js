class GameScene extends Phaser.Scene {


    constructor () {
        super({ key: 'GameScene' });

        this.layers = {}
        this.texts = {}
        this.sprites = {}
        this.shapes = {}
        this.timers = {}
    }

    preload () {
        globals.state = new GameState()
        globals.animationFactory = new AnimationFactory(this)
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
        this.layers.player = this.add.layer().setDepth(2)
        this.layers.pieces = this.add.layer().setDepth(3)
        this.layers.info = this.add.layer().setDepth(4)


        // Info Layer
        this.texts.score = this.add.bitmapText(
            0 + 10,
            0,
            'game-font',
            'Score: ',
            32)
            .setOrigin(0, 0)

        this.texts.level = this.add.bitmapText(
            globals.coords.screenWidth - 10,
            0,
            'game-font',
            'Level: ',
            32)
            .setOrigin(1, 0)

        this.texts.time = this.add.bitmapText(
            globals.coords.screenWidth - 10,
            globals.coords.screenJeight - 10,
            'game-font',
            'Time: ',
            32)
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
        // Animation set
        // this.anims.create({
        //     key: "player-green",
        //     frames: this.anims.generateFrameNumbers('sprites', { frames: [ 0, 1, 2, 3 ] }),
        //     frameRate: 8,
        //     repeat: -1
        // });
        //
        // this.anims.create({
        //     key: "player-blue",
        //     frames: this.anims.generateFrameNumbers('sprites', { frames: [ 4, 5, 6, 7 ] }),
        //     frameRate: 1,
        //     repeat: -1
        // });
        //
        // this.anims.create({
        //     key: "player-orange",
        //     frames: this.anims.generateFrameNumbers('sprites', { frames: [ 8, 9, 10, 11 ] }),
        //     frameRate: 8,
        //     repeat: -1
        // });
        //
        // this.anims.create({
        //     key: "player-purple",
        //     frames: this.anims.generateFrameNumbers('sprites', { frames: [ 12, 13, 14, 15 ] }),
        //     frameRate: 8,
        //     repeat: -1
        // });

        // this.sprites.player = this.add.sprite(unitX * 9, unitY * 9)
        //     .setScale(3)
        //     .play("player-blue")

        // Player Layer
        let playerSprite = this.add.sprite(0, 0, "sprites", 0).setScale(3)
        this.layers.player.add(playerSprite)

        // wire the player sprite into the player object
        globals.state.player.setScene(this)
        globals.state.player.setSprite(playerSprite)

        //this.spriteIndex = 0

        // Piece Layer
        // Animation set
        // this.anims.create({
        //     key: "piece-green-down",
        //     frames: this.anims.generateFrameNumbers('sprites', { frames: [ 16, 17, 18, 19 ] }),
        //     frameRate: 1,
        //     repeat: -1
        // });
        //
        // this.anims.create({
        //     key: "piece-green",
        //     frames: this.anims.generateFrameNumbers('sprites', { frames: [ 16 ] }),
        //     repeat: 0
        // });
        //

        // let greenPiece = this.add.sprite(unitX * 9 + 2, unitY * 1)
        //     .setScale(3)
        //     .setOrigin(0, 0)
        //     .play("piece-green")
        //
        // this.layers.pieces.add(greenPiece)

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
        if (state.firing) {
            return
        }

        // fire the missile and compute it's end point
        state.fireMissile()

        // get the end state
        let endPos = state.firing.endPos

        let startX = globals.coords.boardXToScreenX(state.player.x)
        let startY = globals.coords.boardYToScreenY(state.player.y)

        let endX = globals.coords.boardXToScreenX(endPos.x)
        let endY = globals.coords.boardYToScreenY(endPos.y)

        console.log("Player Pos: " + state.player.x + "," + state.player.y)
        console.log("End Pos: " + endPos.x + "," + endPos.y)
        console.log("Start: " + startX + "," + startY)
        console.log("End: " + endX + "," + endY)

        this.tweens.add({
            targets: this.sprites.player,
            x: endX,
            y: endY,
            duration: 1000,
            onComplete: this.missileFireBounce,
            onCompleteScope: this
        });

    }

    missileFireBounce() {
        let state = globals.state

        let playerX = globals.coords.boardXToScreenX(state.player.x)
        let playerY = globals.coords.boardYToScreenY(state.player.y)

        console.log("missile fire bounce!")
        this.tweens.add({
            targets: this.sprites.player,
            x: playerX,
            y: playerY,
            duration: 1000,
            onComplete: this.missileFireEnd,
            onCompleteScope: this
        });

    }

    missileFireEnd() {
        console.log("missile fire end!")

        globals.state.firing = false;

        this.updatePlayerSprite()
    }

    keyDown(code) {
        console.log("Key Down: " + code)
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
            case "Space":
                this.fireMissile()
                break
            case "Escape":
                this.togglePause();
                break;
        }
    }

    click(pointer, localX, localY, event) {
        globals.state.addNewPiece(this, this.layers.pieces)
        //this.layers.bottom.setVisible(!this.layers.bottom.visible)

        // this.spriteIndex++
        // if (this.spriteIndex >= 4) {
        //     this.spriteIndex = 0
        // }
        // let colors = ["blue", "purple", "green", "orange"]
        // this.sprites.player.play("player-" + colors[this.spriteIndex])
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

    gameOver() {
        // this.sound.stopAll();
        this.scene.start('TitleScene');
    }

    updateInfo() {
        this.texts.score.setText("Score : " + globals.state.score)
        this.texts.level.setText("Level : " + globals.state.level)

        if (this.timers.levelTimer) {
            this.texts.time.setText("Time : " + Math.floor(this.timers.levelTimer.getRemainingSeconds()))
        }
    }


    initLevelTimer() {
        if (this.timers.levelTimer) {
            this.timers.levelTimer.destroy()
        }
        this.timers.levelTimer = this.time.addEvent({
            delay: globals.state.getLevelSeconds() * 1000,
            callback: this.gameOver,
            callbackScope: this
        });

    }

    newPiece() {
        let piece = globals.gameState.generateNextPiece()
        console.log("New Piece: " + piece.type)

        let animation = ""
        switch (piece.type) {
            case PieceType.GREEN:
                animation = "piece-green"
                break;
            case PieceType.BLUE:
                animation = "piece-blue"
                break;
            case PieceType.ORANGE:
                animation = "piece-orange"
                break;
            case PieceType.PURPLE:
                animation = "piece-purple"
                break;
        }

        console.log("this.unitX: " + this.unitX)
        console.log("this.piece.x: " + piece.x)
        let sprite = this.add.sprite(this.unitX * piece.x + 2, this.unitY * piece.y)
             .setScale(3)
             .setOrigin(0, 0)
             .play(animation)

        console.log("Sprite pos: " + sprite.x + "," + sprite.y)
        piece.sprite = sprite

        this.layers.pieces.add(sprite)
        console.log(sprite)

    }

    initNewPieceTimer() {
        if (this.timers.newPieceTimer) {
            this.timers.newPieceTimer.destroy()
        }
        this.timers.newPieceTimer = this.time.addEvent({
            delay: globals.gameState.getNewPieceSeconds() * 1000,
            callback: this.newPiece,
            loop: true,
            callbackScope: this
        });
    }

    update() {
        this.updateInfo()
    }

}
