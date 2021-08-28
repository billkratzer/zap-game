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

        this.firing = false

        this.playerBounds = {
            minX: 8,
            maxX: 11,
            minY: 5,
            maxY: 8
        }

        this.player = new Player(PlayerColor.GREEN, this.playerBounds)
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
        return 60
    }

    on(event, callback, context) {
        this.eventHandlers[event] = { callback: callback, context: context }
    }

    getNewPieceSeconds() {
        return 5
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

    fireMissile() {
        this.firing = {}

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
            case PlayerDirection.UP:
                grid = this.topGrid
                gx = this.player.x - 8
                gy = grid.height - 1
                dy = -1
                break;
            case PlayerDirection.DOWN:
                grid = this.bottomGrid
                gx = this.player.x - 8
                gy = 0
                dy = 1
                break;
            case PlayerDirection.LEFT:
                grid = this.leftGrid
                gx = grid.width - 1
                gy = this.player.y - 5
                dx = -1
                break;
            case PlayerDirection.RIGHT:
                grid = this.rightGrid
                gx = 0
                gy = this.player.y - 5
                dx = 1
                break;
        }

        let done = false
        while (!done) {
            if ( grid.inBounds(gx, gy) ) {
                let piece = grid.getPieceAt(gx, gy)
                if (piece) {
                    if (piece.type === this.player.color) {
                        piece.exploding = true
                    }
                    else {
                        this.firing.newColor = piece.type
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
            case PlayerDirection.UP:
                my = gy
                break;
            case PlayerDirection.DOWN:
                my = gy + 9
                break;
            case PlayerDirection.LEFT:
                mx = gx
                break;
            case PlayerDirection.RIGHT:
                mx = gx + 12
                break;
        }
        this.firing.endPos = {
            x: mx,
            y: my
        }
    }

}