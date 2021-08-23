const PlayerColor = {
    GREEN: "green",
    BLUE: "blue",
    ORANGE: "orange",
    PURPLE: "purple",
}

const PlayerDirection = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
}

class Player {

    constructor(color, bounds) {
        this.color = color
        this.bounds = bounds
        this.direction = PlayerDirection.UP

        this.setPosition(
            Math.floor((this.bounds.minX + this.bounds.maxX) / 2),
            Math.floor((this.bounds.minY + this.bounds.maxY) / 2)
        )
    }

    handleInputDirection(direction) {
        // if (direction === this.direction) {
        //     this.moveDirection(direction)
        // }
        // else {
        //     this.direction = direction;
        // }
        this.moveDirection(direction)
        this.direction = direction;
    }

    moveDirection(direction) {
        switch (direction) {
            case PlayerDirection.LEFT:
                this.x = this.x - 1
                if (this.x < this.bounds.minX) {
                    this.x = this.bounds.minX
                }
                break;
            case PlayerDirection.RIGHT:
                this.x = this.x + 1
                if (this.x > this.bounds.maxX) {
                    this.x = this.bounds.maxX
                }
                break;
            case PlayerDirection.UP:
                this.y = this.y - 1
                if (this.y < this.bounds.minY) {
                    this.y = this.bounds.minY
                }
                break;
            case PlayerDirection.DOWN:
                this.y = this.y + 1
                if (this.y > this.bounds.maxY) {
                    this.y = this.bounds.maxY
                }
                break;
            default:
                throw Error("Invalid direction: " + direction)
        }
    }

    setPosition(x , y) {
        this.x = x
        this.y = y
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }

}