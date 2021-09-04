class NewHighScoreScene extends Phaser.Scene {

    constructor () {
        super({ key: 'NewHighScoreScene' });
    }

    preload () {
    }

    create () {
        console.log("HighScoreScene.create()")

        let highScores = new HighScores()

        let screenWidth = globals.coords.screenWidth
        let screenHeight = globals.coords.screenHeight

        const FONT = "helvetica-neue-white-32"
        let titleText = this.add.bitmapText( screenWidth / 2, 10, FONT, "High Scores", 32)
        titleText.setOrigin(0.5, 0.5)

        let rankTitleText = this.add.bitmapText(screenWidth * 0.30, 40, FONT, "Rank", 24)
        rankTitleText.setOrigin(0.5, 0.5)

        let scoreTitleText = this.add.bitmapText(screenWidth * 0.50, 40, FONT, "Score", 24)
        scoreTitleText.setOrigin(1, 0.5)

        let nameTitleText = this.add.bitmapText(screenWidth * 0.60, 40, FONT, "Name", 24)
        nameTitleText.setOrigin(1, 0.5)

        for (var i = 0; i < highScores.scores.length; i++) {
            let score = highScores.scores[i]
            let rank = i + 1

            let rankText = this.add.bitmapText(screenWidth * 0.30, i * 40 + 80, FONT, "" + rank, 24)
            rankText.setOrigin(0.5, 0.5)

            let pointsText = this.add.bitmapText(screenWidth * 0.50, i * 40 + 80, FONT, score.points, 24)
            pointsText.setOrigin(1, 0.5)

            let nameText = this.add.bitmapText(screenWidth * 0.60, i * 40 + 80, FONT, score.name, 24)
            nameText.setOrigin(0, 0.5)

        }


        this.input.on('pointerup', function(pointer, localX, localY, event) {
            this.nextScene()
        }, this)

        this.input.keyboard.on('keydown', function(pointer, localX, localY, event) {
            this.nextScene()
        }, this)

    }

    nextScene() {
        // this.introMusic.stop();
        this.scene.start('TitleScene');
        // this.scene.start('TestScene');
    }

    update() {

    }

}
