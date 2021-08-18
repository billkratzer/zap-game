const PieceType = {
    GREEN: "green",
    BLUE: "blue",
    ORANGE: "orange",
    PURPLE: "purple",
    BOMB: "bomb",
    BOLT: "bolt"
}

class GamePiece {

    constructor(type) {
        this.type = type
        this.exploding = false
    }

    getType() {
        return this.type
    }

    setPosition(x , y) {
        this.x = x
        this.y = y
    }

    setNewPosition(x, y) {
        this.newX = x
        this.newY = y
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }

    getNewPosition() {
        return {
            x: this.newX,
            y: this.newY
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