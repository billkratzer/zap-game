const PieceType = {
    GREEN: "green",
    BLUE: "blue",
    ORANGE: "orange",
    PURPLE: "purple",
    BOMB: "bomb",
    BOLT: "bolt"
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
        this.sprite.play("piece-" + this.type + "-facing-" + this.direction)
        this.moving = false
    }

    fadeIn() {
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 1,
            duration: 500,
            delay: 500,
            onComplete: this.endFadeIn,
            onCompleteScope: this
        })
    }

    endFadeIn() {

    }


    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }

}