class AnimationFactory {

    constructor(scene) {
        this.scene = scene

        this.buildPieceAnimations()
    }

    range(startAt, size) {
        return [...Array(size).keys()].map(i => i + startAt);
    }

    buildPieceAnimations() {
        let a = this.range(16, 4)
        console.log("a: " + a)
        this.scene.anims.create({
            key: "piece-green-move-down",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(16, 8) }),
            frameRate: 8,
            repeat: -1
        });
    }

}