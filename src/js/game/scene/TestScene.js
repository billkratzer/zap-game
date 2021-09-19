//  Create our own EventEmitter instance
var emitter = new Phaser.Events.EventEmitter();
var score = 0

class TestScene extends Phaser.Scene {

    constructor () {
        super({ key: 'TestScene' });
    }

    preload () {
    }

    init() {
    }


    create() {
        this.scene.launch('TestScenePause')
        this.scene.launch('TestSceneScore')
        this.scene.launch('TestSceneGame')

        this.scene.bringToTop('TestSceneGame')
        this.scene.bringToTop('TestSceneScore')
        this.scene.bringToTop('TestScenePause')

        this.input.keyboard.on('keydown', this.keyDown, this);
    }

    keyDown(code) {
        console.log("TestScene Key Down: ",  code)
        switch (code) {
            case "ArrowUp":
                break;
            case "ArrowDown":
                break;
            case "ArrowLeft":
                break;
            case "ArrowRight":
                break;
            case "Space":
                break;
        }
    }

    nextScene() {
        this.scene.start('TitleScene');
    }

    update() {
    }

}

class TestScenePause extends Phaser.Scene {


    constructor () {
        super({ key: 'TestScenePause' });
    }

    preload () {
    }

    init() {
        this.texts = {}

        const FONT = 'kanit-64-semibold'
        this.texts.paused = this.add.bitmapText(globals.coords.screenWidth / 2, globals.coords.screenHeight / 2, FONT, "Paused", 64)
            .setOrigin(0.5, 0.5)
            .setLetterSpacing(2)
            .setTint(0x5555ff)
            .setAlpha(0)

        this.stuff = {}
        this.stuff.active = false
    }


    create() {
        this.input.keyboard.on('keydown', this.keyDown, this);
        emitter.on('pause', this.showPauseMenu, this);
     }

     showPauseMenu() {
        console.log("Showing the Pause Menu!")
        this.stuff.active = true
        this.texts.paused.setAlpha(1)
     }

    keyDown(event) {
        console.log("TestScenePause Key: ", event.code)
        if (!this.stuff.active) {
            return
        }
        switch (event.code) {
            case "ArrowUp":
                break;
            case "ArrowDown":
                break;
            case "ArrowLeft":
                break;
            case "ArrowRight":
                break;
            case "Space":
                break;
            case "KeyP":
                this.unpause()
                break
        }
    }

    unpause() {
        this.stuff.active = false
        this.texts.paused.setAlpha(0)
        emitter.emit("unpause")
    }

    nextScene() {
        this.scene.start('TitleScene');
    }

    update() {
    }

}

class TestSceneScore extends Phaser.Scene {


    constructor () {
        super({ key: 'TestSceneScore' });
    }

    preload () {
    }

    init() {
    }


    create() {
        this.input.keyboard.on('keydown', this.keyDown, this);
        this.texts = {}

        const FONT = 'kanit-64-semibold'
        this.texts.score = this.add.bitmapText(10, 80, FONT, "Score: ", 64)
            .setOrigin(0, 1)
            .setLetterSpacing(2)
            .setTint(0xeeeeee)

        //  Set-up an event handler
        emitter.on('update-score', this.updateScore, this);
    }

    updateScore() {
        this.texts.score.setText("Score: " + score)
    }

    keyDown(event) {
        //console.log("TestSceneScore Key Down: ", event.code)
        switch (event.code) {
            case "ArrowUp":
                break;
            case "ArrowDown":
                break;
            case "ArrowLeft":
                break;
            case "ArrowRight":
                break;
            case "Space":
                break;
        }
    }

    nextScene() {
        this.scene.start('TitleScene');
    }

    update() {
    }

}

class TestSceneGame extends Phaser.Scene {


    constructor () {
        super({ key: 'TestSceneGame' });
    }

    preload () {
    }

    init() {
    }

    create() {
        this.input.keyboard.on('keydown', this.keyDown, this);
        emitter.on('unpause', this.unpause, this);

        this.shapes = {}
        this.shapes.rect = this.add.rectangle(100, 0, 800, 400, 0xcc2222)
            .setOrigin(0.5, 0)

        let coords = globals.coords
        this.stuff = {}
        this.stuff.circleX = coords.screenWidth / 2
        this.stuff.circleY = coords.screenHeight / 2
        this.stuff.vx = 0
        this.stuff.vy = 0

        this.shapes.circle = this.add.circle(this.stuff.circleX, this.stuff.circleY, 50, 0x33ee33)
            .setOrigin(0.5, 0.5)
    }

    keyDown(event) {
        console.log("TestSceneGame Key Down: ", event.code)
        switch (event.code) {
            case "ArrowUp":
                this.stuff.vy = this.stuff.vy - 1
                break;
            case "ArrowDown":
                this.stuff.vy = this.stuff.vy + 1
                break;
            case "ArrowLeft":
                this.stuff.vx = this.stuff.vx - 1
                break;
            case "ArrowRight":
                this.stuff.vx = this.stuff.vx + 1
                break;
            case "KeyP":
                this.pause()
                break
            case "Space":
                score = score + 100
                console.log("New Score: " + score)
                emitter.emit("update-score")
                break;
        }
    }

    pause() {
        this.stuff.paused = true
        this.scene.pause()
        console.log("Emitting Pause!!!")
        emitter.emit("pause")
    }

    unpause() {
        this.stuff.paused = false
        this.scene.resume()
    }

    nextScene() {
        this.scene.start('TitleScene');
    }

    update() {
        this.stuff.circleX = this.stuff.circleX + this.stuff.vx
        this.stuff.circleY = this.stuff.circleY + this.stuff.vy

        if (this.stuff.circleX < 0) {
            this.stuff.vx = 0 - this.stuff.vx
            this.stuff.vy = 0 - this.stuff.vy
            this.stuff.circleX = 0
        }
        if (this.stuff.circleX > globals.coords.screenWidth) {
            this.stuff.vx = 0 - this.stuff.vx
            this.stuff.vy = 0 - this.stuff.vy
            this.stuff.circleX = globals.coords.screenWidth
        }
        if (this.stuff.circleY < 0) {
            this.stuff.vx = 0 - this.stuff.vx
            this.stuff.vy = 0 - this.stuff.vy
            this.stuff.circleY = 0
        }
        if (this.stuff.circleY > globals.coords.screenHeight) {
            this.stuff.vx = 0 - this.stuff.vx
            this.stuff.vy = 0 - this.stuff.vy
            this.stuff.circleY = globals.coords.screenHeight
        }

        this.shapes.circle.setPosition(this.stuff.circleX, this.stuff.circleY)
    }

}
