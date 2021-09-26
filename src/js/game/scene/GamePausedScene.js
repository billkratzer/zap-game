class GamePausedScene extends Phaser.Scene {

    constructor () {
        super({ key: 'GamePausedScene' });
    }

    init() {
        console.log("GamePausedScene::init()")

        this.texts = {}
        this.state = {}
        this.eventKeys = {}

        this.eventKeys.RESUME_CLICKED = "resume-clicked"
        this.eventKeys.QUIT_CLICKED = "quit-clicked"

        this.theme = globals.colors.getTheme("default")
    }

    preload() {
        globals.emitter.on(Events.PAUSE, this.showPauseMenu, this)
        globals.emitter.on(Events.UNPAUSE, this.hidePauseMenu, this)
    }

    create () {
        console.log("GamePausedScene::create()")

        // Bottom Layer (mostly opaque, black rectangle)
        this.rect = this.add.rectangle(
            0,
            0,
            globals.coords.screenWidth,
            globals.coords.screenHeight,
            0x000000)
            .setOrigin(0, 0)
            .setAlpha(0.80)


        // Top Layer (text and buttons)
        this.textTitle = this.add.bitmapText(
            globals.coords.getScreenMiddleX(),
            globals.coords.getScreenFractionY(0.20),
            "kanit-96-glow",
            'GAME PAUSED',
            96)
            .setOrigin(0.5, 0.5)

        this.buttonResume = new PauseScreenButton(
            this,
            globals.coords.getScreenMiddleX(),
            globals.coords.getScreenFractionY(0.45),
            "RESUME"
        )
        .onClick(this.eventKeys.RESUME_CLICKED)

        this.buttonQuit = new PauseScreenButton(
            this,
            globals.coords.getScreenMiddleX(),
            globals.coords.getScreenFractionY(0.70),
            "QUIT"
        )
        .onClick(this.eventKeys.QUIT_CLICKED)

        this.rect.setVisible(false)
        this.textTitle.setVisible(false)
        this.buttonResume.setVisible(false)
        this.buttonQuit.setVisible(false)

        // Events
        this.events.on(this.eventKeys.RESUME_CLICKED, this.clickResume, this)
        this.events.on(this.eventKeys.QUIT_CLICKED, this.clickQuit, this)
    }

    showPauseMenu() {
        console.log("GamePausedScene::showPauseMenu")
        this.rect.setVisible(true)
        this.textTitle.setVisible(true)
        this.buttonResume.setVisible(true)
        this.buttonQuit.setVisible(true)
    }

    hidePauseMenu() {
        console.log("GamePausedScene::hidePauseMenu")
        this.rect.setVisible(false)
        this.textTitle.setVisible(false)
        this.buttonResume.setVisible(false)
        this.buttonQuit.setVisible(false)
    }

    clickResume() {
        globals.state.setPaused(false)
        this.hidePauseMenu()

        globals.emitter.emit(Events.UNPAUSE)
    }

    clickQuit() {
        this.hidePauseMenu()

        globals.emitter.emit(Events.QUIT)
    }

}

class PauseScreenButton {

    constructor (scene, x, y, text) {
        this.texts = {}
        this.sprites = {}

        this.sprites.button = scene.add.sprite(
            x,
            y,
            "button-400x100"
        )
        .setOrigin(0.5, 0.5)
        .setTint(0x00D1E1)
        .setInteractive()

        this.sprites.border = scene.add.sprite(
            x,
            y,
            "button-border-only-400x100"
        )
        .setOrigin(0.5, 0.5)
        .setTint(0x8BF7FF)

        this.texts.label = scene.add.bitmapText(
            globals.coords.getScreenMiddleX(),
            y,
            "kanit-64-semibold",
            text,
            36)
        .setOrigin(0.5, 0.5)

        this.sprites.button.setData("components", {
            scene: scene,
            spriteButton: this.sprites.button,
            spriteBorder: this.sprites.border,
            textLabel: this.texts.label,
            tween: null,
            clickEvent: null
        })

        this.sprites.button.on('pointerover', function () {
            let data = this.getData("components")
            data.spriteButton.setTint(0xffffff)
            data.spriteBorder.setTint(0xffffff)

            data.tween = data.scene.tweens.add({
                targets: [ data.spriteButton, data.spriteBorder, data.textLabel ],
                scale: 0.9,
                duration: 200,
                yoyo: true,
                loop: -1
            })
        })


        this.sprites.button.on('pointerout', function () {
            let data = this.getData("components")

            data.spriteButton.setTint(0x00D1E1)
            data.spriteBorder.setTint(0x8BF7FF)

            data.spriteButton.setScale(1)
            data.spriteBorder.setScale(1)
            data.textLabel.setScale(1)

            if (data.tween) {
                data.tween.remove()
            }
       })

        this.sprites.button.on('pointerup', function () {
            let data = this.getData("components")
            if (data.clickEvent) {
                data.scene.events.emit(data.clickEvent, data.scene)
            }
        })

    }

    onClick(eventKey) {
        let data = this.sprites.button.getData("components")
        data.clickEvent = eventKey

        return this
    }

    setVisible(visible) {
        this.sprites.button.setVisible(visible)
        this.sprites.border.setVisible(visible)
        this.texts.label.setVisible(visible)
    }

}
