const SurpriseType = {
    DOUBLE_POINTS: "double-points",
    INVERTED_KEYS: "inverted-keys"
}

class Surprise {

    constructor(type) {
        this.types = [
            SurpriseType.DOUBLE_POINTS,
            SurpriseType.INVERTED_KEYS
        ]

        this.titles = []
        this.titles[SurpriseType.DOUBLE_POINTS] = "Double Points"
        this.titles[SurpriseType.INVERTED_KEYS] = "Inverted Keys"

        this.subTitles = []
        this.subTitles[SurpriseType.DOUBLE_POINTS] = "Earn twice as many points"
        this.subTitles[SurpriseType.INVERTED_KEYS] = "Keyboard controls are reversed"

        this.spriteKeys = []
        this.spriteKeys[SurpriseType.DOUBLE_POINTS] = SurpriseType.DOUBLE_POINTS
        this.spriteKeys[SurpriseType.INVERTED_KEYS] = SurpriseType.INVERTED_KEYS


        if (type) {
            this.type = type
        }
        else {
            this.type = this.types[ Phaser.Math.Between(0, types.length - 1) ]
        }

        this.lengthSeconds = 30

    }

    getLengthSeconds() {
        return this.lengthSeconds
    }

    getTitle() {
        return this.titles[this.type]
    }

    getSubTitle() {
        return this.subTitles[this.type]
    }

    buildSprite(scene) {
        return scene.add.sprite(0, 0, this.spriteKeys[this.type])
    }

}