const Side = {
    TOP: "top",
    BOTTOM: "bottom",
    LEFT: "left",
    RIGHT: "right"
}


class GameGrid {

    constructor(width, height, side, addX, addY) {

        this.width = width
        this.height = height
        this.side = side

        this.translate = {
            x: addX,
            y: addY
        }

        this.overflow = false

        this.grid = new Array(width);
        for (var i = 0; i < width; i++) {
            this.grid[i] = new Array(height)
        }
        
    }

    fromBoardXToGridX(boardX) {
        return ( boardX - this.translate.x )
    }

    fromBoardYToGridY(boardY) {
        return ( boardY - this.translate.y )
    }


    fromBoardPosToGridPos(x, y) {
        return {
            x: this.fromBoardXToGridX(x),
            y: this.fromBoardYToGridY(y)
        }
    }

    fromGridXToBoardX(gridX) {
        return gridX + this.translate.x
    }

    fromGridYToBoardY(gridY) {
        return gridY + this.translate.y
    }

    fromGridPosToBoardPos(x, y) {
        return {
            x: this.fromGridXToBoardX(x),
            y: this.fromGridYToBoardY(y)
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

    randomInt(upper) {
        return Math.floor(Math.random() * upper);
    }

    addNewPiece(type, scene, layer) {
        var x = 0
        var y = 0
        var shiftX = 0
        var shiftY = 0

        if (!this.side) {
            throw new Error("Side is not defined!")
        }

        let facing = ""
        switch (this.side) {
            case Side.TOP:
                x = this.randomInt(this.width)
                y = 0
                shiftX = 0
                shiftY = 1
                facing = Direction.DOWN
                break
            case Side.BOTTOM:
                x = this.randomInt(this.width)
                y = this.height - 1
                shiftX = 0
                shiftY = -1
                facing = Direction.UP
                break
            case Side.LEFT:
                x = 0
                y = this.randomInt(this.height)
                shiftX = 1
                shiftY = 0
                facing = Direction.RIGHT
                break
            case Side.RIGHT:
                x = this.width - 1
                y = this.randomInt(this.height)
                facing = Direction.LEFT
                shiftX = -1
                break
            default:
                throw new Error("Invalid value for side: " + this.side)
        }

        let newPiece = new GamePiece(type, facing, this, scene, layer)
        newPiece.setPosition(x, y)
        newPiece.fadeIn()

        let movingPieces = []

        let done = false
        while ( !done ) {
            let piece = this.getPieceAt(x, y)
            this.setPieceAt(x, y, null)
            if ( piece ) {
                x = x + shiftX
                y = y + shiftY
                piece.moveToPosition(x, y, facing)
                movingPieces.push(piece)
            }
            else {
                done = true
            }
            if (( x < 0 ) || ( x >= this.width )) {
                this.overflow = true
                done = true
            }
            if (( y < 0 ) || ( y >= this.height )) {
                this.overflow = true
                done = true
            }
        }
        if (this.overflow) {
            return
        }

        for (var i = 0; i < movingPieces.length; i++) {
            let piece = movingPieces[i]
            this.setPieceAt(piece.x, piece.y, piece)
        }

        this.setPieceAt(newPiece.x, newPiece.y, newPiece)

        return newPiece
    }


}