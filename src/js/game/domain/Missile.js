const MISSILE_THICKNESS = 20

class Missile {


    constructor() {
        this.color = PlayerColor.GREEN
        this.x = -1
        this.y = -1
        this.direction = Direction.UP

        this.firing = false

        this.shimmer = {
            width: false,
            height: false
        }

        this.colors = []

        this.updateTick = 0
    }

    buildSprite(scene, layer) {
        this.scene = scene
        this.layer = layer

        // sprite creation will be defered until we know what direction we are firing!

        // this.rect = this.scene.add.rectangle(
        //     0,
        //     0,
        //     0,
        //     0,
        //     0x00ff00)
        //     .setOrigin(0, 0)
        //     .setAlpha(0.50)


        // this.layer.add(this.rect)
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

    getTint() {
        let theme = globals.colors.getTheme("default")
        switch (this.color) {
            case PlayerColor.GREEN:
                return theme.piece1
            case PlayerColor.BLUE:
                return theme.piece2
            case PlayerColor.ORANGE:
                return theme.piece3
            case PlayerColor.PURPLE:
                return theme.piece4
        }
    }

    computeColors() {
        this.colors = []

        let color = this.getTint()
        for (let i = 0; i < 10; i++) {
            this.colors.push(color)
            color = color.clone().lighten(8)
        }
    }

    fire(fromX, fromY, toX, toY, startColor, endColor, explodingPieces, pieceToChange) {
        if (this.firing) {
            return
        }

        this.color = startColor
        this.computeColors()

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

        // build the sprite
        switch (this.direction) {
            case Direction.UP:
                this.sprite = this.scene.add.sprite(fromScreenX, fromScreenY, "vertical-fire", 0)
                    .setOrigin(0.5, 1)
                this.sprite.displayWidth = MISSILE_THICKNESS
                this.sprite.displayHeight = 0
                destWidth = MISSILE_THICKNESS
                destHeight = globals.coords.boardYUnits(length)
                this.shimmer.width = true
                break;
            case Direction.DOWN:
                this.sprite = this.scene.add.sprite(fromScreenX, fromScreenY, "vertical-fire", 0)
                    .setOrigin(0.5, 0)
                this.sprite.displayWidth = MISSILE_THICKNESS
                this.sprite.displayHeight = 0
                destWidth = MISSILE_THICKNESS
                destHeight = globals.coords.boardYUnits(length)
                this.shimmer.width = true
                break;
            case Direction.LEFT:
                this.sprite = this.scene.add.sprite(fromScreenX, fromScreenY, "horizontal-fire", 0)
                    .setOrigin(1, 0.5)
                this.sprite.displayWidth = 0
                this.sprite.displayHeight = MISSILE_THICKNESS
                destWidth = globals.coords.boardXUnits(length)
                destHeight = MISSILE_THICKNESS
                this.shimmer.height = true
                break;
            case Direction.RIGHT:
                this.sprite = this.scene.add.sprite(fromScreenX, fromScreenY, "horizontal-fire", 0)
                    .setOrigin(0, 0.5)
                this.sprite.displayWidth = 0
                this.sprite.displayHeight = MISSILE_THICKNESS
                destWidth = globals.coords.boardXUnits(length)
                destHeight = MISSILE_THICKNESS
                this.shimmer.height = true
                break;
        }
        this.layer.add(this.sprite)

        this.sprite.setTint(this.getTint().color)
        this.sprite.setPosition(fromScreenX, fromScreenY)

        let bounceDestWidth = this.sprite.displayWidth
        let bounceDestHeight =this.sprite.displayHeight

        const TWEEN_MILLIS = 100
        this.scene.tweens.add({
            targets: this.sprite,
            displayWidth: destWidth,
            displayHeight: destHeight,
            duration: TWEEN_MILLIS,
            onComplete: this.bounce,
            onCompleteScope: this,
            onCompleteParams: [
                 bounceDestWidth,
                 bounceDestHeight,
                 endColor
            ]
        })


        let fromScreenPos = globals.coords.boardPosToScreenPos({ x: fromX, y: fromY })
        let toScreenPos = globals.coords.boardPosToScreenPos({ x: toX, y: toY })

        let diffX = fromScreenPos.x - toScreenPos.x
        let diffY = fromScreenPos.y - toScreenPos.y
        let totalDistance = Math.sqrt(diffX * diffX + diffY * diffY)

        // Compute when to explode the pieces
        let streak = 1
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
                args: [ globals.state.calcPoints(streak) ]
            })
            streak++
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

    bounce(tween, target, destWidth, destHeight, newColor) {
        this.color = newColor
        this.computeColors()

        this.sprite.setTint(this.getTint().color)

        this.scene.tweens.add({
            targets: this.sprite,
            displayWidth: destWidth,
            displayHeight: destHeight,
            duration: 100,
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

        this.shimmer.width = false
        this.shimmer.height = false

        if (this.sprite) {
            this.sprite.destroy()
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

    update() {

        if (this.shimmer.width) {
            this.sprite.displayWidth = Phaser.Math.Between(MISSILE_THICKNESS - 5, MISSILE_THICKNESS + 5)
            this.sprite.setTint(this.colors[this.updateTick % this.colors.length].color)
            this.updateTick++
        }
        if (this.shimmer.height) {
            this.sprite.displayHeight = Phaser.Math.Between(MISSILE_THICKNESS - 5, MISSILE_THICKNESS + 5)
            this.sprite.setTint(this.colors[this.updateTick % this.colors.length].color)
            this.updateTick++
        }
    }

}