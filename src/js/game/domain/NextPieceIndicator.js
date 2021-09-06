class NextPieceIndicator {

    constructor() {
    }

    buildSprite(scene, layer) {
        this.scene = scene
        this.layer = layer

        this.sprite = this.scene.add.sprite(0, 0, "sprites-2", 0).setScale(3).setOrigin(0.5, 0.5).setAlpha(100)
        this.sprite.play("next-piece-indicator")
        this.layer.add(this.sprite)
    }

    setNextPiece(type, grid, gx, gy) {
        this.type = type
        this.grid = grid
        this.gx = gx
        this.gy = gy
    }

    getType() {
        return this.type
    }

    getGrid() {
        return this.grid
    }

    getGridPos() {
        return {
            x: this.gx,
            y: this.gy
        }
    }

    updatePosition() {
        let boardPos = this.grid.fromGridPosToBoardPos(this.gx, this.gy)
        // this.sprite.setPosition(
        //     globals.coords.boardXToScreenX(boardPos.x),
        //     globals.coords.boardYToScreenY(boardPos.y)
        // )

        this.scene.tweens.add({
            targets: this.sprite,
            x: globals.coords.boardXToScreenX(boardPos.x),
            y: globals.coords.boardYToScreenY(boardPos.y),
            duration: 500,
            delay: 500
            // onComplete: this.endMoveSprite,
            // onCompleteScope: this
        })
    }

    moveToPosition(x , y, direction) {
        // this.scene.tweens.add({
        //     targets: this.sprite,
        //     x: globals.coords.boardXToScreenX(boardPos.x),
        //     y: globals.coords.boardYToScreenY(boardPos.y),
        //     duration: 500,
        //     delay: 0,
        //     onComplete: this.endMoveSprite,
        //     onCompleteScope: this
        // })
        // this.sprite.play("piece-" + this.type + "-moving-" + this.direction)
        //
        // this.moving = true
    }

    // endMoveSprite() {
    //     this.sprite.play("piece-" + this.type + "-facing-" + this.direction)
    //     this.moving = false
    // }

    // fadeIn() {
    //     this.scene.tweens.add({
    //         targets: this.sprite,
    //         alpha: 1,
    //         duration: 500,
    //         delay: 500,
    //         onComplete: this.endFadeIn,
    //         onCompleteScope: this
    //     })
    // }


}