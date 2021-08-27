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

        this.exploding = false

        this.sprite = this.scene.add.sprite(0, 0, "sprites", 0).setScale(3).setOrigin(0.5, 0.5)
        this.sprite.play("piece-" + this.type + "-facing-" + this.direction)
        this.layer.add(this.sprite)
    }

    getType() {
        return this.type
    }

    setPosition(x , y) {
        this.x = x
        this.y = y

        let boardPos = this.grid.fromGridPosToBoardPos(this.x, this.y)

        this.sprite.setPosition(
            globals.coords.boardXToScreenX(boardPos.x),
            globals.coords.boardYToScreenY(boardPos.y)
        )
    }

    animateIn() {
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }

    isMoving() {
        return ( this.newX && this.newY )
    }

    moveToNewPosition() {
        this.x = this.newX
        this.y = this.newY

        this.newX = null
        this.newY = null
    }

}