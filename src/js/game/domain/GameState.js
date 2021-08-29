const GameEvent = {
    PIECE_MOVE: "on-piece-move",
    PIECE_EXPLODE: "on-piece-explode"
}


class GameState {

    constructor() {

        this.lives = 3
        this.score = 0
        this.level = 1
        this.nextPieceType = this.getRandomPieceType()
        this.paused = false

        this.BOARD_WIDTH = 20
        this.BOARD_HEIGHT = 14


        this.grids = []
        this.leftGrid = new GameGrid(8, 4, Side.LEFT, 0, 5)
        this.rightGrid = new GameGrid(8, 4, Side.RIGHT, 12, 5)
        this.topGrid = new GameGrid(4, 5, Side.TOP, 8, 0)
        this.bottomGrid = new GameGrid(4, 5, Side.BOTTOM, 8, 9)

        this.grids.push(this.leftGrid, this.rightGrid, this.topGrid, this.bottomGrid)

        this.playerBounds = {
            minX: 8,
            maxX: 11,
            minY: 5,
            maxY: 8
        }

        this.player = new Player(PlayerColor.GREEN, this.playerBounds)
        this.missile = new Missile()
    }

    togglePaused() {
        this.paused = !this.paused
    }

    addNewPiece(scene, layer) {
        let type = this.getRandomPieceType()
        this.selectRandomGrid().addNewPiece(type, scene, layer)

    }

    selectRandomGrid() {
        return this.grids[ Math.floor( Math.random() * this.grids.length) ]
    }

    getRandomPieceType() {
        let types = [ PieceType.BLUE, PieceType.GREEN, PieceType.ORANGE, PieceType.PURPLE ]

        return types[ Math.floor( Math.random() * types.length)]
    }

    getLevelSeconds() {
        return 10
    }

    on(event, callback, context) {
        this.eventHandlers[event] = { callback: callback, context: context }
    }

    getNewPieceSeconds() {
        let secondsByLevel = [5, 4, 3, 2, 1, 0.5, 0.25]

        let index = this.level - 1
        if (index < secondsByLevel.length) {
            return secondsByLevel[index]
        }
        else {
            return secondsByLevel[secondsByLevel.length - 1]
        }
    }

    calcPoints(streak) {
        return streak * 10
    }

    addScore(points) {
        this.score = this.score + 10 * points
    }

    isGameOver() {
        let over = false
        this.grids.forEach(
            grid => {
                if (grid.overflow) {
                    over = true
                }
            }
        )
        return over
    }

    levelUp() {
        this.level++
    }

    fireMissile() {

        let firingInfo = {}

        // location of the missile on the board
        let mx = this.player.x
        let my = this.player.y

        // location of the missile relative to the grid
        let gx = 0
        let gy = 0

        // delta of the missile (depends on direction)
        let dx = 0
        let dy = 0

        // The grid that we are facing
        let grid = null

        switch (this.player.direction) {
            case Direction.UP:
                grid = this.topGrid
                gx = this.player.x - 8
                gy = grid.height - 1
                dy = -1
                break;
            case Direction.DOWN:
                grid = this.bottomGrid
                gx = this.player.x - 8
                gy = 0
                dy = 1
                break;
            case Direction.LEFT:
                grid = this.leftGrid
                gx = grid.width - 1
                gy = this.player.y - 5
                dx = -1
                break;
            case Direction.RIGHT:
                grid = this.rightGrid
                gx = 0
                gy = this.player.y - 5
                dx = 1
                break;
        }

        let done = false

        firingInfo.explodingPieces = []
        firingInfo.startColor = this.player.color
        firingInfo.endColor = this.player.color

        while (!done) {
            if ( grid.inBounds(gx, gy) ) {
                let piece = grid.getPieceAt(gx, gy)
                if (piece) {
                    if (piece.type === this.player.color) {
                        firingInfo.explodingPieces.push(piece)
                        grid.setPieceAt(gx, gy, null)
                        gx = gx + dx
                        gy = gy + dy
                    }
                    else {
                        firingInfo.endColor = piece.type
                        firingInfo.pieceToChange = piece
                        done = true

                    }
                }
                else {
                    gx = gx + dx
                    gy = gy + dy
                }
            }
            else {
                done = true
            }
        }

        // mx and mx represent the final state of the bullet
        switch (this.player.direction) {
            case Direction.UP:
                my = gy
                break;
            case Direction.DOWN:
                my = gy + 9
                break;
            case Direction.LEFT:
                mx = gx
                break;
            case Direction.RIGHT:
                mx = gx + 12
                break;
        }
        firingInfo.endPos = {
            x: mx,
            y: my
        }

        return firingInfo
    }

}