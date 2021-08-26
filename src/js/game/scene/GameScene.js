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
        globals.gameState = new GameState()

        globals.gameState.on(GameEvent.PIECE_MOVE, this.onPieceMove, this)
    }


    togglePause() {
        let state = globals.gameState
        state.togglePaused()

        if (state.paused) {
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
        this.layers.bottom = this.add.layer().setDepth(0)
        this.layers.dots = this.add.layer().setDepth(1)
        this.layers.player = this.add.layer().setDepth(2)
        this.layers.pieces = this.add.layer().setDepth(3)
        this.layers.info = this.add.layer().setDepth(4)



        let camera = this.cameras.main
        let width = camera.width
        let height = camera.height

        camera.setBackgroundColor("#333")

        let unitX = width / 20
        let unitY = height / 14

        this.unitX = unitX
        this.unitY = unitY

        // Info Layer
        this.texts.score = this.add.bitmapText(0 + 10, 0, 'game-font', 'Score: ', 32)
            .setOrigin(0, 0)

        this.texts.level = this.add.bitmapText(width - 10, 0, 'game-font', 'Level: ', 32)
            .setOrigin(1, 0)

        this.texts.time = this.add.bitmapText(width - 10, height - 10, 'game-font', 'Time: ', 32)
            .setOrigin(1, 1)

        this.layers.info.add([this.texts.score, this.texts.level, this.texts.time])

        // Bottom Layer
        let playerRectBox = this.add.rectangle(unitX * 8, unitY * 5, unitX * 4, unitY * 4, 0xff0000).setOrigin(0, 0)
        this.layers.bottom.add(playerRectBox)

        // Dots Layer
        for (let x = 0; x < unitX; x++) {
            for (let y = 5; y < 9; y++) {
                let dot = this.add.circle(x * unitX + unitX / 2, y * unitY + unitY / 2, 2, 0xffffff).setOrigin(0.5, 0.5)
                this.layers.dots.add(dot)
            }
        }

        for (let x = 8; x < 12; x++) {
            for (let y = 0; y < 14; y++) {
                let dot = this.add.circle(x * unitX + unitX / 2, y * unitY + unitY / 2, 2, 0xffffff).setOrigin(0.5, 0.5)
                this.layers.dots.add(dot)
            }
        }

        // Player Layer
        // Animation set
        this.anims.create({
            key: "player-green",
            frames: this.anims.generateFrameNumbers('sprites', { frames: [ 0, 1, 2, 3 ] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: "player-blue",
            frames: this.anims.generateFrameNumbers('sprites', { frames: [ 4, 5, 6, 7 ] }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: "player-orange",
            frames: this.anims.generateFrameNumbers('sprites', { frames: [ 8, 9, 10, 11 ] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: "player-purple",
            frames: this.anims.generateFrameNumbers('sprites', { frames: [ 12, 13, 14, 15 ] }),
            frameRate: 8,
            repeat: -1
        });

        // this.sprites.player = this.add.sprite(unitX * 9, unitY * 9)
        //     .setScale(3)
        //     .play("player-blue")

        this.sprites.player = this.add.sprite(0, 0, "sprites", 0)
            .setScale(3)
        this.layers.player.add(this.sprites.player)

        this.updatePlayerSprite()

        //this.spriteIndex = 0

        // Piece Layer
        // Animation set
        this.anims.create({
            key: "piece-green-down",
            frames: this.anims.generateFrameNumbers('sprites', { frames: [ 16, 17, 18, 19 ] }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: "piece-green",
            frames: this.anims.generateFrameNumbers('sprites', { frames: [ 16 ] }),
            repeat: 0
        });

        this.anims.create({
            key: "piece-blue",
            frames: this.anims.generateFrameNumbers('sprites', { frames: [ 16 + 32 ] }),
            repeat: 0
        });

        this.anims.create({
            key: "piece-orange",
            frames: this.anims.generateFrameNumbers('sprites', { frames: [ 16 + 64 ] }),
            repeat: 0
        });

        this.anims.create({
            key: "piece-purple",
            frames: this.anims.generateFrameNumbers('sprites', { frames: [ 16 + 96] }),
            repeat: 0
        });

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

    logicalToScreenX(x) {
        return x * this.unitX + this.unitX / 2 + 4
    }

    logicalToScreenY(y) {
        return y * this.unitY + this.unitY / 2 + 4
    }

    logicalToScreenPos(x, y) {
        return {
            x: this.logicalToScreenX(x),
            y: this.logicalToScreenY(y)
        }
    }

    fireMissile() {
        let state = globals.gameState

        // if we are already firing, do nothing
        if (state.firing) {
            return
        }

        // fire the missile and compute it's end point
        state.fireMissile()

        // get the end state
        let endPos = state.firing.endPos

        let startX = this.logicalToScreenX(state.player.x)
        let startY = this.logicalToScreenY(state.player.y)

        let endX = this.logicalToScreenX(endPos.x)
        let endY = this.logicalToScreenY(endPos.y)

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
        let state = globals.gameState

        let playerX = this.logicalToScreenX(state.player.x)
        let playerY = this.logicalToScreenX(state.player.y)

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

        globals.gameState.firing = false;

        this.updatePlayerSprite()
    }

    keyDown(code) {
        console.log("Key Down: " + code)
        if (globals.gameState.paused) {
            switch (code) {
                case "Escape":
                    this.togglePause();
                    break;
                case "KeyQ":
                    if (globals.gameState.paused) {
                        this.quit();
                    }
                    break;
            }
            return;
        }

        let player = globals.gameState.player
        switch (code) {
            case "ArrowLeft":
                player.handleInputDirection(PlayerDirection.LEFT)
                this.updatePlayerSprite()
                break
            case "ArrowRight":
                player.handleInputDirection(PlayerDirection.RIGHT)
                this.updatePlayerSprite()
                break
            case "ArrowUp":
                player.handleInputDirection(PlayerDirection.UP)
                this.updatePlayerSprite()
                break
            case "ArrowDown":
                player.handleInputDirection(PlayerDirection.DOWN)
                this.updatePlayerSprite()
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
        this.texts.score.setText("Score : " + globals.gameState.score)
        this.texts.level.setText("Level : " + globals.gameState.level)

        if (this.timers.levelTimer) {
            this.texts.time.setText("Time : " + Math.floor(this.timers.levelTimer.getRemainingSeconds()))
        }
    }

    updatePlayerSprite() {
        let sprite = this.sprites.player
        let player = globals.gameState.player

        let colorOffset = 0
        switch (player.color) {
            case PlayerColor.GREEN:
                colorOffset = 0
                break
            case PlayerColor.BLUE:
                colorOffset = 4
                break
            case PlayerColor.ORANGE:
                colorOffset = 8
                break
            case PlayerColor.PURPLE:
                colorOffset = 12
                break
        }

        let dirOffset = 0
        switch (player.direction) {
            case PlayerDirection.UP:
                dirOffset = 2
                break
            case PlayerDirection.DOWN:
                dirOffset = 0
                break
            case PlayerDirection.LEFT:
                dirOffset = 3
                break
            case PlayerDirection.RIGHT:
                dirOffset = 1
                break
        }
        sprite.setFrame(colorOffset + dirOffset)

        // Position
        let pos = player.getPosition()
        sprite.setPosition(this.logicalToScreenX(pos.x), this.logicalToScreenY(pos.y))
    }

    initLevelTimer() {
        if (this.timers.levelTimer) {
            this.timers.levelTimer.destroy()
        }
        this.timers.levelTimer = this.time.addEvent({
            delay: globals.gameState.getLevelSeconds() * 1000,
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
