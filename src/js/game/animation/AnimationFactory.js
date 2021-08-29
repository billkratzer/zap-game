class AnimationFactory {

    constructor(scene) {
        this.scene = scene

        this.buildPieceAnimations()
    }

    range(startAt, size) {
        return [...Array(size).keys()].map(i => i + startAt);
    }

    buildPieceAnimations() {
        this.buildPieceAnimationsForColor(PieceType.GREEN, 16)
        this.buildPieceAnimationsForColor(PieceType.BLUE, 16 + 32)
        this.buildPieceAnimationsForColor(PieceType.ORANGE, 16 + 32 * 2)
        this.buildPieceAnimationsForColor(PieceType.PURPLE, 16 + 32 * 3)

        this.buildPlayerAnimationsForColor(PieceType.GREEN, 0)
        this.buildPlayerAnimationsForColor(PieceType.BLUE, 0 + 4)
        this.buildPlayerAnimationsForColor(PieceType.ORANGE, 0 + 4 * 2)
        this.buildPlayerAnimationsForColor(PieceType.PURPLE, 0 + 4 * 3)

        this.buildExplosion()
    }

    buildExplosion() {
        this.scene.anims.create({
            key: "explosion",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(8 * 18, 4) }),
            frameRate: 16,
            repeat: 0
        });
    }

    buildPlayerAnimationsForColor(color, offset) {
        this.scene.anims.create({
            key: "player-" + color + "-down",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(offset, 1) }),
            frameRate: 8,
            repeat: 0
        });
        this.scene.anims.create({
            key: "player-" + color + "-right",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(offset + 1, 1) }),
            frameRate: 8,
            repeat: 0
        });
        this.scene.anims.create({
            key: "player-" + color + "-up",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(offset + 2, 1) }),
            frameRate: 8,
            repeat: 0
        });
        this.scene.anims.create({
            key: "player-" + color + "-left",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(offset + 3, 1) }),
            frameRate: 8,
            repeat: 0
        });
    }

    buildPieceAnimationsForColor(color, offset) {
        this.scene.anims.create({
            key: "piece-" + color + "-facing-down",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(offset, 1) }),
            frameRate: 8,
            repeat: 0
        });

        this.scene.anims.create({
            key: "piece-" + color + "-moving-down",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(offset, 8) }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: "piece-" + color + "-facing-right",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(offset + 8, 1) }),
            frameRate: 8,
            repeat: 0
        });

        this.scene.anims.create({
            key: "piece-" + color + "-moving-right",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(offset + 8, 8) }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: "piece-" + color + "-facing-up",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(offset + 16, 1) }),
            frameRate: 8,
            repeat: 0
        });

        this.scene.anims.create({
            key: "piece-" + color + "-moving-up",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(offset + 16, 8) }),
            frameRate: 8,
            repeat: -1
        });

        this.scene.anims.create({
            key: "piece-" + color + "-facing-left",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(offset + 24, 1) }),
            frameRate: 8,
            repeat: 0
        });

        this.scene.anims.create({
            key: "piece-" + color + "-moving-left",
            frames: this.scene.anims.generateFrameNumbers('sprites', { frames: this.range(offset + 24, 8) }),
            frameRate: 8,
            repeat: -1
        });
    }

}