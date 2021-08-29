class Missile {

    constructor() {
        this.color = PlayerColor.GREEN
        this.x = -1
        this.y = -1
        this.direction = Direction.UP

        this.firing = false
    }

    buildSprite(scene, layer) {
        this.scene = scene
        this.layer = layer

        this.rect = this.scene.add.rectangle(
            0,
            0,
            0,
            0,
            0x00ff00)
            .setOrigin(0, 0)
            .setAlpha(0.50)

        this.layer.add(this.rect)
    }

    toHexColor(color) {
        switch (color) {
            case PlayerColor.GREEN: {
                return 0x00ff00
                break
            }
            case PlayerColor.BLUE: {
                return 0x0000ff
                break
            }
            case PlayerColor.PURPLE: {
                return 0x800080
                break
            }
            case PlayerColor.ORANGE: {
                return 0xffa500
                break
            }
        }
        return 0xffffff
    }

    fire(fromX, fromY, toX, toY, startColor, endColor, explodingPieces, pieceToChange) {
        // console.log("Firing missile from: " + fromX + "," + fromY + " to " + toX + "," + toY)

        if (this.firing) {
            return
        }

        this.firing = true
        let length = 0
        if (toX > fromX) {
            this.direction = Direction.RIGHT
            length = toX - fromX
        }
        else if (toX < fromX) {
            this.direction = Direction.LEFT
            length = fromX - toX
        }
        else if (toY > fromY) {
            this.direction = Direction.DOWN
            length = toY - fromY
        }
        else if (toY < fromY) {
            this.direction = Direction.UP
            length = fromY - toY
        }
        else {
            throw new Error("Unable to determine missile direction")
        }

        this.x = fromX
        this.y = fromY

        let fromScreenX = globals.coords.boardXToScreenX(fromX)
        let fromScreenY = globals.coords.boardYToScreenY(fromY)

        let destWidth = 0
        let destHeight = 0

        let bounceDestWidth = 0
        let bounceDestHeight = 0

        let toScreenX = fromScreenX
        let toScreenY = fromScreenY

        switch (this.direction) {
            case Direction.UP:
                this.rect.width = globals.coords.boardXUnits(0.5)
                this.rect.height = 0
                destWidth = globals.coords.boardXUnits(0.5)
                destHeight = globals.coords.boardYUnits(length)
                toScreenY = fromScreenY - destHeight

                fromScreenX = fromScreenX - globals.coords.boardXUnits(0.25)
                toScreenX = toScreenX - globals.coords.boardXUnits(0.25)

                bounceDestWidth = destWidth
                bounceDestHeight = 0
                break;
            case Direction.DOWN:
                this.rect.width = globals.coords.boardXUnits(0.5)
                this.rect.height = 0
                destWidth = globals.coords.boardXUnits(0.5)
                destHeight = globals.coords.boardYUnits(length)

                fromScreenX = fromScreenX - globals.coords.boardXUnits(0.25)
                toScreenX = toScreenX - globals.coords.boardXUnits(0.25)

                bounceDestWidth = destWidth
                bounceDestHeight = 0
                break;
            case Direction.LEFT:
                this.rect.width = 0
                this.rect.height = globals.coords.boardYUnits(0.5)
                destWidth = globals.coords.boardXUnits(length)
                destHeight = globals.coords.boardYUnits(0.5)
                toScreenX = fromScreenX - destWidth

                fromScreenY = fromScreenY - globals.coords.boardYUnits(0.25)
                toScreenY = toScreenY - globals.coords.boardYUnits(0.25)

                bounceDestWidth = 0
                bounceDestHeight = destHeight
                break;
            case Direction.RIGHT:
                this.rect.width = 0
                this.rect.height = globals.coords.boardYUnits(0.5)
                destWidth = globals.coords.boardXUnits(length)
                destHeight = globals.coords.boardYUnits(0.5)

                fromScreenY = fromScreenY - globals.coords.boardYUnits(0.25)
                toScreenY = toScreenY - globals.coords.boardYUnits(0.25)

                bounceDestWidth = 0
                bounceDestHeight = destHeight
                break;
        }

        let bounceToScreenX = fromScreenX
        let bounceToScreenY = fromScreenY


        this.rect.setOrigin(0, 0)
        this.rect.setPosition(fromScreenX, fromScreenY)
        this.rect.fillColor = this.toHexColor(startColor)

        const TWEEN_MILLIS = 200
        this.scene.tweens.add({
            targets: this.rect,
            x: toScreenX,
            y: toScreenY,
            width: destWidth,
            height: destHeight,
            duration: TWEEN_MILLIS,
            onComplete: this.bounce,
            onCompleteScope: this,
            onCompleteParams: [
                bounceToScreenX,
                bounceToScreenY,
                bounceDestWidth,
                bounceDestHeight,
                endColor,
            ]
        })


        let fromScreenPos = globals.coords.boardPosToScreenPos({ x: fromX, y: fromY })
        let toScreenPos = globals.coords.boardPosToScreenPos({ x: toX, y: toY })

        let diffX = fromScreenPos.x - toScreenPos.x
        let diffY = fromScreenPos.y - toScreenPos.y
        let totalDistance = Math.sqrt(diffX * diffX + diffY * diffY)

        // Compute when to explode the pieces
        for (var i = 0; i < explodingPieces.length; i++) {
            let piece = explodingPieces[i]

            let screenPos = piece.getScreenPosition()
            diffX = fromScreenPos.x - screenPos.x
            diffY = fromScreenPos.y - screenPos.y
            let pieceDistance = Math.sqrt(diffX * diffX + diffY * diffY)

            let delayMillis = TWEEN_MILLIS * (pieceDistance / totalDistance)
            this.scene.time.addEvent({
                delay: delayMillis,
                callback: piece.explode,
                callbackScope: piece,
            })
        }

        // Is there a piece that should change color?
        if (pieceToChange) {
            this.scene.time.addEvent({
                delay: TWEEN_MILLIS,
                callback: pieceToChange.changeColor,
                callbackScope: pieceToChange,
                args: [ startColor ]
            })
        }

    }

    bounce(tween, target, destX, destY, destWidth, destHeight, newColor) {
        console.log("bounce: " + destX + "," + destY + "," + destWidth + "," + destHeight)

        this.rect.fillColor = this.toHexColor(newColor)

        this.scene.tweens.add({
            targets: this.rect,
            x: destX,
            y: destY,
            width: destWidth,
            height: destHeight,
            duration: 200,
            onComplete: this.endFire,
            onCompleteScope: this,
            onCompleteParams: [
                newColor
            ]
        })

    }

    endFire(tween, target, newColor) {
        globals.state.player.changeColor(newColor)

        this.firing = false

        if (this.rect) {
            this.rect.width = 0
            this.rect.height = 0
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