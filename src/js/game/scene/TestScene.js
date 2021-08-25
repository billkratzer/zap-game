class TestScene extends Phaser.Scene {


    constructor () {
        super({ key: 'TestScene' });

        console.log("TestScene.()")
        this.layers = {}
        this.texts = {}
        this.sprites = {}
        this.shapes = {}
        this.timers = {}
        this.tools = {}
    }

    preload () {
        this.tools.animationFactory = new AnimationFactory(this)
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

        const BOARD_WIDTH = 20
        const BOARD_HEIGHT = 14

        this.coords = new ScreenCoords(camera.width, camera.height, BOARD_WIDTH, BOARD_HEIGHT)

        camera.setBackgroundColor("#333")

        // Info Layer
        this.texts.title = this.add.bitmapText(0 + 10, 0, 'game-font', 'Testing Scene', 32)
            .setOrigin(0, 0)

        this.layers.info.add([this.texts.title])

        console.log('here')

        // Bottom Layer
        let playerRectBox = this.add.rectangle(
            this.coords.getScreenMiddleX(),
            this.coords.getScreenMiddleY(),
            this.coords.boardXUnits(4),
            this.coords.boardYUnits(4),
            0xff0000).setOrigin(0.5, 0.5)
        this.layers.bottom.add(playerRectBox)


        // Dots Layer
        for (let x = 0; x < BOARD_WIDTH; x++) {
            for (let y = 5; y < 9; y++) {
                let dot = this.add.circle(
                    this.coords.boardXToScreenX(x),
                    this.coords.boardYToScreenY(y),
                    2,
                    0xffffff).setOrigin(0.5, 0.5)
                this.layers.dots.add(dot)
            }
        }

        for (let x = 8; x < 12; x++) {
            for (let y = 0; y < 14; y++) {
                let dot = this.add.circle(
                    this.coords.boardXToScreenX(x),
                    this.coords.boardYToScreenY(y),
                    2,
                    0xffffff).setOrigin(0.5, 0.5)
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

        this.sprites.player = this.add.sprite(
            this.coords.boardXToScreenX(9),
            this.coords.boardYToScreenY(6),
            "sprites",
            0)
            .setScale(3)
        this.layers.player.add(this.sprites.player)

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

        let greenPiece = this.add.sprite(this.coords.boardXToScreenX(6), this.coords.boardXToScreenX(2))
            .setScale(3)
            .setOrigin(0, 0)
            .play("piece-green-move-down")

        this.layers.pieces.add(greenPiece)

        return


        // Events

        this.input.on('pointerdown', this.click, this);

        this.input.keyboard.on('keydown', function (event) {
            this.keyDown(event.code);
        }, this);

    }

    logicalToScreenX(x) {
        return x * this.unitX + this.unitX / 2 + 4
    }

    logicalToScreenY(y) {
        return y * this.unitY + this.unitY / 2 + 4
    }


    keyDown(code) {
        console.log("Key Down: " + code)
    }

    click(pointer, localX, localY, event) {
    }

    gameOver() {
        // this.sound.stopAll();
        this.scene.start('TitleScene');
    }

    update() {
    }

}
