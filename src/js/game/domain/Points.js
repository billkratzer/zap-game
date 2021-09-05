class Points {

    constructor(points, boardX, boardY) {
        this.points = points
        this.screenX = globals.coords.boardXToScreenX(boardX)
        this.screenY = globals.coords.boardYToScreenY(boardY)
    }

    buildSprite(scene, layer) {
        this.scene = scene
        this.layer = layer

        this.text = this.scene.add.bitmapText(
            this.screenX,
            this.screenY,
            "kanit-32-medium",
            "" + this.points,
            48)
            .setOrigin(0.5, 0.5)

        this.layer.add(this.text)
    }

    flyHome() {
        const TWEEN_MILLIS = 500
        this.scene.tweens.add({
            targets: this.text,
            x: 100,
            y: 20,
            duration: TWEEN_MILLIS,
            onComplete: this.endFlyHome,
            onCompleteScope: this,
        })
    }

    endFlyHome() {
        globals.state.addScore(this.points)

        this.text.destroy()
    }

}