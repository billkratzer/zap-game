const Side = {
    LEFT: "left",
    RIGHT: "right",
    TOP: "top",
    BOTTOM: "bottom"
}

class GameGrid {

    constructor(width, height, side, translate) {

        this.width = width
        this.height = height
        this.translate = translate

        // this is the side where new pieces come from
        this.side = side

        this.overflow = false

        this.grid = new Array(width);
        for (var i = 0; i < width; i++) {
            this.grid[i] = new Array(height)
        }
        
    }

    clear() {
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                this.grid[x][y] = null
            }
        }
    }

    inBounds(x, y) {
        if (x < 0) {
            return false
        }
        if (x >= this.width) {
            return false
        }
        if (y < 0) {
            return false
        }
        if (y > this.height) {
            return false
        }
        return true
    }

    getPieceAt(x, y) {
        return this.grid[x][y]
    }

    setPieceAt(x, y, piece) {
        this.grid[x][y] = piece
    }

    isOverflow() {
        return this.overflow
    }

    randomInt(upper) {
        return Math.floor(Math.random() * upper);
    }

    addPiece(type) {
        var x = 0
        var y = 0
        var shiftX = 0
        var shiftY = 0

        if (!this.side) {
            throw new Error("Side is not defined!")
        }

        switch (this.side) {
            case Side.TOP:
                x = this.randomInt(this.width)
                y = 0
                shiftX = 0
                shiftY = 1
                break
            case Side.BOTTOM:
                x = this.randomInt(this.width)
                y = this.height - 1
                shiftX = 0
                shiftY = -1
                break
            case Side.LEFT:
                x = 0
                y = this.randomInt(this.height)
                shiftX = 1
                shiftY = 0
                break
            case Side.RIGHT:
                x = this.width - 1
                y = this.randomInt(this.height)
                shiftX = -1
                break
            default:
                throw new Error("Invalid value for side: " + this.side)
        }

        let newPiece = new GamePiece(type, this.translate)
        newPiece.setPosition(x - shiftX, y - shiftY)
        newPiece.setNewPosition(x, y)
        this.newPiece = newPiece

        var done = false
        while ( !done ) {
            var piece = this.getPieceAt(x, y)
            if ( piece ) {
                x = x + shiftX
                y = y + shiftY
                piece.setNewPosition(x, y)
            }
            else {
                done = true
            }
            if (( x < 0 ) || ( x >= this.width )) {
                done = true
            }
            if (( y < 0 ) || ( y >= this.height )) {
                done = true
            }

        }

        return newPiece
    }

    getMovingPieces() {
        let moving = []

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let piece = this.getPieceAt(x, y)
                if ( piece && piece.isMoving() ) {
                    moving.push(piece)
                }
            }
        }

        return moving
    }

    commitMoves() {
        let movingPieces = []

        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let piece = this.getPieceAt(x, y)
                if ( piece && piece.isMoving() ) {
                    movingPieces.push(piece)
                    this.setPieceAt(x, y, null)
                }
            }
        }

        for (let i = 0; i < movingPieces.length; i++ ) {
            movingPieces[i].moveToNewPosition()
            let pos = movingPieces[i].getPosition()
            this.setPieceAt(pos.x, pos.y, savedPieces[i])

            if ((pos.x < 0) || (pos.x >= width)) {
                this.overflow = true
            }
            if ((pos.y < 0) || (pos.y >= height)) {
                this.overflow = true
            }
        }

        this.newPiece.moveToNewPosition()
        let pos = this.newPiece.getPosition()
        this.setPieceAt(pos.x, pos.y, this.newPiece)

        this.newPiece = null
    }

}