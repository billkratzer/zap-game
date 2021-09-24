let rainbowWave = 0
let surpriseTitleCounter = 0
let surpriseSubTitleCounter = 0

class GameSurpriseScene extends Phaser.Scene {

    constructor () {
        super({ key: 'GameSurpriseScene' });
    }

    init() {
        console.log("GameSurpriseScene::init()")

        this.layers = {}
        this.texts = {}
        this.sprites = {}
    }

    preload() {
        globals.emitter.on(Events.NEW_SURPRISE, this.showModal, this)
    }


    create () {
        console.log("GameSurpriseScene::create()")

        this.layers.background = this.add.layer().setDepth(0)
        this.layers.foreground = this.add.layer().setDepth(20)

        let rectBackground = this.add.rectangle(
            0,
            0,
            globals.coords.screenWidth,
            globals.coords.screenHeight,
            0x000000)
            .setOrigin(0, 0)

        this.layers.background.add(rectBackground)
        this.layers.background.setAlpha(0)

        let sprite = globals.state.surprise.buildSprite(this)
        sprite.setOrigin(0, 0)

        let textTitle = this.add.dynamicBitmapText(0, 0, 'kanit-64-semibold', globals.state.surprise.getTitle().toUpperCase(), 64)
            .setOrigin(0, 0)
            .setDisplayCallback(this.titleCallback);

        let textSubTitle = this.add.dynamicBitmapText(0, 0, 'kanit-64-semibold', globals.state.surprise.getSubTitle().toUpperCase(), 24)
            .setOrigin(0, 1)
            .setDisplayCallback(this.subTitleCallback);

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

        this.sprites.icon = sprite

        let textX = modalX + modalMargin + sprite.displayWidth + modalMargin
        textTitle.setPosition(textX, modalY + modalMargin - 20)
        textSubTitle.setPosition(textX, modalY + modalMargin + sprite.displayHeight + 5)

        this.layers.foreground.add([rectModal, sprite, textTitle, textSubTitle])
        this.layers.foreground.setAlpha(0)
    }

    titleCallback(data) {
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

    subTitleCallback(data) {

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

    showModal() {
        this.tweens.add({
            targets: [this.layers.background, this.layers.foreground],
            alpha: 1,
            duration: 500,
            ease: 'Back',
            easeParams: [ 1 ],
        })

        this.tweens.add({
            targets: [this.layers.background, this.layers.foreground],
            alpha: 0,
            delay: 3000,
            duration: 500,
            ease: 'Back',
            easeParams: [ 1 ],
        })

        this.tweens.add({
            targets: this.sprites.icon,
            x: 10,
            y: globals.coords.screenHeight - 100 - 10,
            scale: 100 / sprite.displayHeight,
            delay: 3000,
            duration: 500,
            ease: 'Back',
            easeParams: [ 1 ],
            onComplete: this.onSpriteMoveEnd,
            onCompleteScope: this,
        })

    }

    onSpriteMoveEnd(tween, targets) {
        this.layers.foreground.remove(this.sprites.icon)

        // destroy all children in the surprise modal
        let children = this.layers.surprise.getChildren()
        for (let i = 0; i < children.length; i++) {
            let child = children[i]
            this.layers.surprise.remove(child)
            child.destroy()
        }

        globals.emitter.emit(Events.START_NEW_SURPRISE, this.sprites.icon)
    }

    update() {
    }

}
