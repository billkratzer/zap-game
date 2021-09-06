const PlayerColor = {
    GREEN: PieceType.GREEN,
    BLUE: PieceType.BLUE,
    ORANGE: PieceType.ORANGE,
    PURPLE: PieceType.PURPLE,
}



class Player {

    constructor(color, bounds) {
        this.color = color
        this.bounds = bounds
        this.direction = Direction.UP

        this.scene = null
        this.sprite = null

        this.moving = false

        this.setPosition(
            Math.floor((this.bounds.minX + this.bounds.maxX) / 2),
            Math.floor((this.bounds.minY + this.bounds.maxY) / 2)
        )
    }

    getRotation(fromDirection, toDirection) {
        let fromUp = []
        fromUp[Direction.UP] = 0
        fromUp[Direction.DOWN] = 180
        fromUp[Direction.LEFT] = -90
        fromUp[Direction.RIGHT] = 90

        let fromDown = []
        fromDown[Direction.UP] = 180
        fromDown[Direction.DOWN] = 0
        fromDown[Direction.LEFT] = 90
        fromDown[Direction.RIGHT] = -90

        let fromLeft = []
        fromLeft[Direction.UP] = 90
        fromLeft[Direction.DOWN] = -90
        fromLeft[Direction.LEFT] = 0
        fromLeft[Direction.RIGHT] = 180

        let fromRight = []
        fromRight[Direction.UP] = -90
        fromRight[Direction.DOWN] = 90
        fromRight[Direction.LEFT] = 180
        fromRight[Direction.RIGHT] = 0

        switch (fromDirection) {
            case Direction.UP:
                return fromUp[toDirection]
            case Direction.DOWN:
                return fromDown[toDirection]
            case Direction.LEFT:
                return fromLeft[toDirection]
            case Direction.RIGHT:
                return fromRight[toDirection]
        }

        return 0
    }

    move(direction, dx, dy) {

        if (this.moving) {
            return
        }

        this.deltaRotation = Phaser.Math.DegToRad(this.getRotation(this.direction, direction))

        this.moving = true
        this.direction = direction

        this.x = this.x + dx
        if (this.x < this.bounds.minX) {
            this.x = this.bounds.minX
            this.moving = false
        }
        if (this.x > this.bounds.maxX) {
            this.x = this.bounds.maxX
            this.moving = false
        }

        this.y = this.y + dy
        if (this.y < this.bounds.minY) {
            this.y = this.bounds.minY
            this.moving = false
        }
        if (this.y > this.bounds.maxY) {
            this.y = this.bounds.maxY
            this.moving = false
        }

        this.scene.tweens.add({
            targets: this.sprite,
            rotation: this.deltaRotation,
            duration: 80,
            delay: 0,
            onComplete: this.endRotateSprite,
            onCompleteScope: this
        })

        if (!this.moving) {
            return
        }

        this.scene.tweens.add({
            targets: this.sprite,
            x: globals.coords.boardXToScreenX(this.x),
            y: globals.coords.boardYToScreenY(this.y),
            duration: 80,
            delay: 80,
            onComplete: this.endMoveSprite,
            onCompleteScope: this
        })
    }

    endRotateSprite() {
        this.sprite.setRotation(0)
        this.sprite.play("player-" + this.color + "-" + this.direction)
    }

    endMoveSprite() {
        this.sprite.play("player-" + this.color + "-" + this.direction)
        this.moving = false
    }

    setScene(scene) {
        this.scene = scene
    }

    buildSprite(scene, layer) {
        this.scene = scene
        this.layer = layer

        this.sprite = this.scene.add.sprite(0, 0, "sprites", 0)
            .setScale(3)
            .setOrigin(0.5, 0.5)

        this.sprite.setPosition(
            globals.coords.boardXToScreenX(this.x),
            globals.coords.boardYToScreenY(this.y)
        )
        this.sprite.play("player-" + this.color + "-" + this.direction)

        this.layer.add(this.sprite)
    }

    changeColor(newColor) {
        this.color = newColor
        this.sprite.play("player-" + this.color + "-" + this.direction)
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