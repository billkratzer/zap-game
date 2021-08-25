class ScreenCoords {

    constructor(screenWidth, screenHeight, boardWidth, boardHeight) {
        this.screenWidth = screenWidth
        this.screenHeight = screenHeight
        this.boardWidth = boardWidth
        this.boardHeight = boardHeight
    }

    getScreenMiddleX() {
        return this.screenWidth / 2
    }

    getScreenMiddleY() {
        return this.screenHeight / 2
    }

    getScreenMiddlePos() {
        return {
            x: this.getScreenMiddleX(),
            y: this.getScreenMiddleY()
        }
    }

    getScreenFractionX(fraction) {
        return this.screenWidth * fraction
    }

    getScreenFractionY(fraction) {
        return this.screenHeight * fraction
    }

    getScreenFractionPos(fractionX, fractionY) {
        return {
            x: this.getScreenFractionX(fractionX),
            y: this.getScreenFractionY(fractionY)
        }
    }

    boardXToScreenX(boardX) {
        let unitX = this.screenWidth / this.boardWidth
        return boardX * unitX + unitX / 2
    }

    boardYToScreenY(boardY) {
        let unitY = this.screenHeight / this.boardHeight
        return boardY * unitY + unitY / 2
    }

    boardXUnits(n) {
        let unitX = this.screenWidth / this.boardWidth
        return unitX * n
    }

    boardYUnits(n) {
        let unitY = this.screenHeight / this.boardHeight
        return unitY * n
    }

    boardPosToScreenPos(boardPos) {
        return {
            x: this.boardXToScreenX(boardPos.x),
            y: this.boardYToScreenY(boardPos.y)
        }
    }

}