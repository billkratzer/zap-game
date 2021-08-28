class Missile {

    constructor() {
        this.color = PlayerColor.GREEN
        this.x = -1
        this.y = -1
        this.direction = Direction.UP

        this.moving = false
    }

    buildSprite(scene, layer) {
        this.scene = scene
        this.layer = layer

        this.rect = this.scene.add.rectangle(
            10,
            10,
            50,
            50,
            0x00ff00)
            .setOrigin(0.5, 0.5)

        this.layer.add(this.rect)
    }

    fire(fromX, fromY, toX, toY) {
        console.log("Firing missile from: " + fromX + "," + fromY + " to " + toX + "," + toY)

        if (this.moving) {
            return
        }

        this.moving = true
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
        this.rect.setPosition(
            globals.coords.boardXToScreenX(fromX),
            globals.coords.boardYToScreenY(fromY)
        )

        let destWidth = 0
        let destHeight = 0

        switch (this.direction) {
            case Direction.UP:
                console.log("computing up")
                this.rect.width = globals.coords.boardXUnits(1)
                this.rect.height = 0
                this.rect.setOrigin(0.5, 1)
                destWidth = globals.coords.boardXUnits(1)
                destHeight = globals.coords.boardYUnits(length)
                break;
            case Direction.DOWN:
                console.log("computing down")
                this.rect.width = globals.coords.boardXUnits(1)
                this.rect.height = 0
                this.rect.setOrigin(0.5, 0)
                destWidth = globals.coords.boardXUnits(1)
                destHeight = globals.coords.boardYUnits(length)
                break;
            case Direction.LEFT:
                console.log("computing left")
                this.rect.width = 0
                this.rect.height = globals.coords.boardYUnits(1)
                this.rect.setOrigin(1, 0.5)
                destWidth = globals.coords.boardXUnits(length)
                destHeight = globals.coords.boardYUnits(1)
                break;
            case Direction.RIGHT:
                console.log("computing right")
                this.rect.width = 0
                this.rect.height = globals.coords.boardYUnits(1)
                this.rect.setOrigin(0, 0.5)
                destWidth = globals.coords.boardXUnits(length)
                destHeight = globals.coords.boardYUnits(1)
                break;
        }

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

        this.scene.tweens.add({
            targets: this.rect,
            x: globals.coords.boardXToScreenX(fromX) + 0,
            y: globals.coords.boardXToScreenX(fromY) - destHeight,
            originX: 0.5,
            originY: 1,
            width: destWidth,
            height: destHeight,
            duration: 1000,
            onComplete: this.bounce,
        })

        // this.tweens.add({
        //     targets: this.sprites.player,
        //     x: endX,
        //     y: endY,
        //     duration: 1000,
        //     onComplete: this.missileFireBounce,
        //     onCompleteScope: this
        // });

        // this.scene.tweens.add({
        //     targets: this.sprite,
        //     x: globals.coords.boardXToScreenX(this.x),
        //     y: globals.coords.boardYToScreenY(this.y),
        //     duration: 100,
        //     delay: 0,
        //     onComplete: this.endMoveSprite,
        //     onCompleteScope: this
        // })
    }

    bounce() {
        this.moving = false
    }

    endMoveSprite() {
        // this.sprite.play("player-" + this.color + "-" + this.direction)
        // this.moving = false
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