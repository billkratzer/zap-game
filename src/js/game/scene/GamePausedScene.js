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

        this.components = {

        }

        let coords = globals.coords

        // Bottom Layer (mostly opaque, black rectangle)
        this.components.rect = this.add.rectangle(0, 0, coords.screenWidth, coords.screenHeight, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(0.80)

        // Top Layer (text and buttons)
        this.components.textTitle = this.add.bitmapText(
            coords.getScreenMiddleX(), 
            coords.getScreenFractionY(0.20), 
            "kanit-96-glow", 
            'GAME PAUSED', 
            96)
            .setOrigin(0.5, 0.5)

        this.components.buttonResume = new PauseScreenButton(
            this,
            coords.getScreenMiddleX(),
            coords.getScreenFractionY(0.50),
            "RESUME"
        )
        .onClick(this.eventKeys.RESUME_CLICKED)

        this.components.buttonQuit = new PauseScreenButton(
            this,
            coords.getScreenMiddleX(),
            coords.getScreenFractionY(0.70),
            "QUIT"
        )
        .onClick(this.eventKeys.QUIT_CLICKED)

        // hide everything
        this.showComponents(false)

        // Events
        this.events.on(this.eventKeys.RESUME_CLICKED, this.clickResume, this)
        this.events.on(this.eventKeys.QUIT_CLICKED, this.clickQuit, this)
    }

    showComponents(bool) {
        this.components.rect.setVisible(bool)
        this.components.textTitle.setVisible(bool)
        this.components.buttonResume.setVisible(bool)
        this.components.buttonQuit.setVisible(bool)
    }

    showPauseMenu() {
        console.log("GamePausedScene::showPauseMenu")
        this.showComponents(true)
    }

    hidePauseMenu() {
        console.log("GamePausedScene::hidePauseMenu")
        this.showComponents(false)
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
        this.components = {}

        this.components.button = scene.add.sprite(x, y, "button-400x100")
        .setOrigin(0.5, 0.5)
        .setTint(0x00D1E1)
        .setInteractive()

        this.components.border = scene.add.sprite(x, y, "button-border-only-400x100")
        .setOrigin(0.5, 0.5)
        .setTint(0x8BF7FF)

        this.components.label = scene.add.bitmapText(
            globals.coords.getScreenMiddleX(),
            y,
            "kanit-64-semibold",
            text,
            36)
        .setOrigin(0.5, 0.5)

        this.components.button.setData("components", {
            scene: scene,
            spriteButton: this.components.button,
            spriteBorder: this.components.border,
            textLabel: this.components.label,
            tween: null,
            clickEvent: null
        })

        this.components.button.on('pointerover', function () {
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


        this.components.button.on('pointerout', function () {
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

        this.components.button.on('pointerup', function () {
            let data = this.getData("components")
            if (data.clickEvent) {
                data.scene.events.emit(data.clickEvent, data.scene)
            }
        })

    }

    onClick(eventKey) {
        let data = this.components.button.getData("components")
        data.clickEvent = eventKey

        return this
    }

    setVisible(visible) {
        this.components.button.setVisible(visible)
        this.components.border.setVisible(visible)
        this.components.label.setVisible(visible)
    }

}
