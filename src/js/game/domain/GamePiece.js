const PieceType = {
    GREEN: "green",
    BLUE: "blue",
    ORANGE: "orange",
    PURPLE: "purple",
    BOMB: "bomb",
    BOLT: "bolt",
    SURPRISE: "surprise"
}

class GamePiece {

    constructor(type, direction, grid, scene, layer) {
        this.type = type
        this.direction = direction
        this.grid = grid
        this.scene = scene
        this.layer = layer
        this.moving = false
        this.x = -1
        this.y = -1

        this.exploding = false

        this.sprite = this.scene.add.sprite(0, 0, "sprites", 0).setScale(3).setOrigin(0.5, 0.5).setAlpha(0)
        this.sprite.play("piece-" + this.type + "-facing-" + this.direction)
        this.layer.add(this.sprite)

    }

    getType() {
        return this.type
    }

    setPosition(x, y) {
        this.x = x
        this.y = y
        let boardPos = this.grid.fromGridPosToBoardPos(this.x, this.y)
        this.sprite.setPosition(
            globals.coords.boardXToScreenX(boardPos.x),
            globals.coords.boardYToScreenY(boardPos.y)
        )
    }

    moveToPosition(x , y, direction) {
        this.x = x
        this.y = y

        let boardPos = this.grid.fromGridPosToBoardPos(this.x, this.y)

        this.scene.tweens.add({
            targets: this.sprite,
            x: globals.coords.boardXToScreenX(boardPos.x),
            y: globals.coords.boardYToScreenY(boardPos.y),
            duration: 500,
            delay: 0,
            onComplete: this.endMoveSprite,
            onCompleteScope: this
        })
        this.sprite.play("piece-" + this.type + "-moving-" + this.direction)

        this.moving = true
    }

    endMoveSprite() {
        if (this.sprite) {
            this.sprite.play("piece-" + this.type + "-facing-" + this.direction)
        }
        this.moving = false
    }

    fadeIn() {
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 1,
            duration: 500,
            delay: 0,
            onComplete: this.endFadeIn,
            onCompleteScope: this
        })
    }

    explode(points) {
        this.exploding = true

        if (this.sprite) {
            this.sprite.play("explosion-" + this.type)
            this.scene.tweens.add({
                targets: this.sprite,
                scale: 0.5,
                duration: 500,
            })

            this.scene.time.addEvent({
                delay: 200,
                callback: this.startFade,
                callbackScope: this,
            })
        }


        let boardPos = this.grid.fromGridPosToBoardPos(this.x, this.y)
        let pts = new Points(points, boardPos.x, boardPos.y)
        pts.buildSprite(this.scene, this.layer)
        pts.flyHome()

        globals.soundfx.play("ui-quirky-31")
    }

    startFade() {
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            duration: 200,
            onComplete: this.endFade,
            onCompleteScope: this
        })
    }

    endFade() {
        this.sprite.destroy()
    }

    changeColor(color) {
        if (this.sprite) {
            this.scene.tweens.add({
                targets: this.sprite,
                scale: 1,
                duration: 100,
                delay: 0,
                onComplete: this.endSpriteShrink,
                onCompleteScope: this,
                onCompleteParams: [ color ]
            })
        }
    }

    endSpriteShrink(tween, targets, color) {
        this.type = color
        this.sprite.play("piece-" + this.type + "-facing-" + this.direction)

        this.scene.tweens.add({
            targets: this.sprite,
            scale: 3,
            duration: 100,
            delay: 0
        })
    }


    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }

    getBoardPosition() {
        return this.grid.fromGridPosToBoardPos(this.x, this.y)
    }

    getScreenPosition() {
        return globals.coords.boardPosToScreenPos(this.getBoardPosition())
    }

}