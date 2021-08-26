const PieceType = {
    GREEN: "green",
    BLUE: "blue",
    ORANGE: "orange",
    PURPLE: "purple",
    BOMB: "bomb",
    BOLT: "bolt"
}

class GamePiece {

    constructor(type, translate) {
        this.type = type
        this.translate = translate
        this.exploding = false
        this.sprite = null
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

    getBoardPosition() {
        return {
            x: this.x + this.translate.x,
            y: this.y + this.translate.y
        }
    }

    getNewBoardPosition() {
        return {
            x: this.newX + this.translate.x,
            y: this.newY + this.translate.y
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