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

    move(direction, dx, dy) {

        if (this.moving) {
            return
        }

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

        this.sprite.play("player-" + this.color + "-" + this.direction)

        if (!this.moving) {
            return
        }

        this.scene.tweens.add({
            targets: this.sprite,
            x: globals.coords.boardXToScreenX(this.x),
            y: globals.coords.boardYToScreenY(this.y),
            duration: 100,
            delay: 0,
            onComplete: this.endMoveSprite,
            onCompleteScope: this
        })
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