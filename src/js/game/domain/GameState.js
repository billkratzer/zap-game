class GameState {

    constructor() {

        this.lives = 3
        this.score = 0
        this.level = 1
        this.nextPieceType = null
        this.paused = false

        this.grids = []
        this.leftGrid = new GameGrid(8, 4, Side.LEFT)
        this.rightGrid = new GameGrid(8, 4, Side.RIGHT)
        this.topGrid = new GameGrid(4, 5, Side.TOP)
        this.bottomGrid = new GameGrid(4, 5, Side.BOTTOM)

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

    generateNextPiece() {
        let type = this.getRandomPieceType()
        this.selectRandomGrid().addPiece(type)
        this.nextPieceType = type
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
                console.log("Checking top grid")
                grid = this.topGrid
                gx = this.player.x - 8
                gy = grid.height - 1
                dy = -1
                break;
            case PlayerDirection.DOWN:
                console.log("Checking bottom grid")
                grid = this.bottomGrid
                gx = this.player.x - 8
                gy = 0
                dy = 1
                break;
            case PlayerDirection.LEFT:
                console.log("Checking left grid")
                grid = this.leftGrid
                gx = grid.width - 1
                gy = this.player.y - 5
                dx = -1
                break;
            case PlayerDirection.RIGHT:
                console.log("Checking right grid")
                grid = this.rightGrid
                gx = 0
                gy = this.player.y - 5
                dx = 1
                break;
        }

        let done = false
        while (!done) {
            console.log("checking at: " + gx + "," + gy);
            if ( grid.inBounds(gx, gy) ) {
                let piece = grid.getPieceAt(gx, gy)
                console.log("Grid piece at: " + gx + "," + gy + ": " + piece )
                if (piece) {
                    if (piece.type === this.player.color) {
                        console.log("Found color match of " + piece.type + " at: " + gx + "," + gy)
                        piece.exploding = true
                    }
                    else {
                        console.log("Bouncing back with color of " + piece.type + " at: " + gx + "," + gy)
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
                console.log("Out of bounds");
                done = true
            }
        }

        // mx and mx represent the final state of the bullet
        console.log("Done: mx = " + mx + ", my = " + my)
        console.log("Done: gx = " + gx + ", gy = " + gy)
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
        console.log("Done: mx = " + mx + ", my = " + my)
        this.firing.endPos = {
            x: mx,
            y: my
        }
    }

}