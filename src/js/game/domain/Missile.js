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

        this.layer.add(this.rect)
    }

    fire(fromX, fromY, toX, toY) {
        console.log("Firing missile from: " + fromX + "," + fromY + " to " + toX + "," + toY)

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
        console.log("Missile is firing: " + this.direction)

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
                console.log("computing up")
                this.rect.width = globals.coords.boardXUnits(1)
                this.rect.height = 0
                destWidth = globals.coords.boardXUnits(1)
                destHeight = globals.coords.boardYUnits(length)
                toScreenY = fromScreenY - destHeight

                fromScreenX = fromScreenX - globals.coords.boardXUnits(0.5)
                toScreenX = toScreenX - globals.coords.boardXUnits(0.5)

                bounceDestWidth = destWidth
                bounceDestHeight = 0
                break;
            case Direction.DOWN:
                console.log("computing down")
                this.rect.width = globals.coords.boardXUnits(1)
                this.rect.height = 0
                destWidth = globals.coords.boardXUnits(1)
                destHeight = globals.coords.boardYUnits(length)

                fromScreenX = fromScreenX - globals.coords.boardXUnits(0.5)
                toScreenX = toScreenX - globals.coords.boardXUnits(0.5)

                bounceDestWidth = destWidth
                bounceDestHeight = 0
                break;
            case Direction.LEFT:
                console.log("computing left")
                this.rect.width = 0
                this.rect.height = globals.coords.boardYUnits(1)
                destWidth = globals.coords.boardXUnits(length)
                destHeight = globals.coords.boardYUnits(1)
                toScreenX = fromScreenX - destWidth

                fromScreenY = fromScreenY - globals.coords.boardYUnits(0.5)
                toScreenY = toScreenY - globals.coords.boardYUnits(0.5)

                bounceDestWidth = 0
                bounceDestHeight = destHeight
                break;
            case Direction.RIGHT:
                console.log("computing right")
                this.rect.width = 0
                this.rect.height = globals.coords.boardYUnits(1)
                destWidth = globals.coords.boardXUnits(length)
                destHeight = globals.coords.boardYUnits(1)

                fromScreenY = fromScreenY - globals.coords.boardYUnits(0.5)
                toScreenY = toScreenY - globals.coords.boardYUnits(0.5)

                bounceDestWidth = 0
                bounceDestHeight = destHeight
                break;
        }

        let bounceToScreenX = fromScreenX
        let bounceToScreenY = fromScreenY


        console.log("Before tween x:", this.rect.x)
        console.log("Before tween y:", this.rect.y)
        console.log("Before tween width:", this.rect.width)
        console.log("Before tween height:", this.rect.height)

        console.log("Tween x: " + globals.coords.boardXToScreenX(fromX))
        console.log("Tween y: " + globals.coords.boardXToScreenX(fromY))
        console.log("Tween originX: " + 0.5)
        console.log("Tween originY: " + 1)
        console.log("Tween width: " + destWidth)
        console.log("Tween height: " + destHeight)

        this.rect.setOrigin(0, 0)
        this.rect.setPosition(fromScreenX, fromScreenY)

        this.scene.tweens.add({
            targets: this.rect,
            x: toScreenX,
            y: toScreenY,
            width: destWidth,
            height: destHeight,
            duration: 1000,
            onComplete: this.bounce,
            onCompleteScope: this,
            onCompleteParams: [
                bounceToScreenX,
                bounceToScreenY,
                bounceDestWidth,
                bounceDestHeight
            ]
        })

    }

    bounce(tween, target, destX, destY, destWidth, destHeight) {
        console.log("bounce: " + destX + "," + destY + "," + destWidth + "," + destHeight)

        this.scene.tweens.add({
            targets: this.rect,
            x: destX,
            y: destY,
            width: destWidth,
            height: destHeight,
            duration: 1000,
            onComplete: this.endFire,
            onCompleteScope: this
        })

    }

    endFire() {
        console.log("End fire!!!!")
        console.log("@@@ This.firing:" + this.firing)
        this.firing = false
        console.log("@@@ Globals.state.firing: " + globals.state.missile.firing)

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