class HighScoreScene extends Phaser.Scene {

    constructor () {
        super({ key: 'HighScoreScene' });
    }

    preload () {
    }

    create () {
        console.log("HighScoreScene.create()")

        let highScores = new HighScores()

        let screenWidth = globals.coords.screenWidth
        let screenHeight = globals.coords.screenHeight

        // Screen Title
        const FONT = "game-font"
        let titleText = this.add.bitmapText( screenWidth / 2, 20, FONT, "High Scores", 64)
            .setOrigin(0.5, 0)

        let y = screenHeight * .20

        // Table Title
        let titleTint = Phaser.Display.Color.HexStringToColor("#85C1E9")

        let rankTitleText = this.add.bitmapText(screenWidth * 0.30, y, FONT, "Rank", 32)
            .setOrigin(0.5, 0.5)
            .setTint(titleTint.color)

        let scoreTitleText = this.add.bitmapText(screenWidth * 0.55, y, FONT, "Score", 32)
            .setOrigin(1, 0.5)
            .setTint(titleTint.color)

        let nameTitleText = this.add.bitmapText(screenWidth * 0.65, y, FONT, "Name", 32)
            .setOrigin(0, 0.5)
            .setTint(titleTint.color)

        let titleTints = []
        for (var i = 0; i <= 20; i++) {
            titleTints.push(titleTint)
            titleTint = titleTint.clone().lighten(1)
        }

        this.tweens.addCounter(
            {
                from: 0,
                to: 20,
                loop: -1,
                delay: 0,
                duration: 1000,
                yoyo: true,
                onUpdate: this.titleTextUpdate,
                onUpdateParams: [
                    [rankTitleText, scoreTitleText, nameTitleText],
                    titleTints
                ],
                onUpdateScope: this
            }
        )


        y = y + 48

        // 10 highscroe lines
        let scoreTint = Phaser.Display.Color.HexStringToColor("#D4AC0D")

        let scoreTints = []
        for (var i = 0; i <= 20; i++) {
            scoreTints.push(scoreTint)
            scoreTint = scoreTint.clone().lighten(3)
        }

        let endRankX = screenWidth * 0.30
        let endScoreX = screenWidth * 0.55
        let endNameX = screenWidth * 0.65
        for (var i = 0; i < highScores.scores.length; i++) {
            let score = highScores.scores[i]
            let rank = i + 1

            let startRankX = endRankX
            let startScoreX = endScoreX
            let startNameX = endNameX
            if ( (i % 2) == 0) {
                startRankX = startRankX - screenWidth
                startScoreX = startScoreX - screenWidth
                startNameX = startNameX - screenWidth
            }
            else {
                startRankX = startRankX + screenWidth
                startScoreX = startScoreX + screenWidth
                startNameX = startNameX + screenWidth
            }

            let rankText = this.add.bitmapText(startRankX, y, FONT, "" + rank, 32)
                .setOrigin(0.5, 0.5)
                .setTint(scoreTints[i].color)

            this.tweens.add({
                targets: rankText,
                x: endRankX,
                duration: 1000,
                ease: 'Back',
                easeParams: [ 0.5 ],
                delay: i * 100
            });

            let scoreText = this.add.bitmapText(startScoreX, y, FONT, score.points, 32)
                .setOrigin(1, 0.5)
                .setTint(scoreTints[i].color)

            this.tweens.add({
                targets: scoreText,
                x: endScoreX,
                duration: 1000,
                ease: 'Back',
                easeParams: [ 0.5 ],
                delay: i * 100
            });

            let nameText = this.add.bitmapText(startNameX, y, FONT, score.name, 32)
                .setOrigin(0, 0.5)
                .setTint(scoreTints[i].color)

            this.tweens.add({
                targets: nameText,
                x: endNameX,
                duration: 1000,
                ease: 'Back',
                easeParams: [ 0.5 ],
                delay: i * 100
            });

            this.tweens.addCounter(
                {
                    from: 0,
                    to: 20,
                    loop: -1,
                    delay: 100 * i,
                    duration: 500,
                    yoyo: true,
                    onUpdate: this.scoreTextUpdate,
                    onUpdateParams: [
                        [rankText, scoreText, nameText],
                        scoreTints
                    ],
                    onUpdateScope: this
                }
            )

            y = y + 48
        }


        this.input.on('pointerup', function(pointer, localX, localY, event) {
            this.nextScene()
        }, this)

        this.input.keyboard.on('keydown', function(pointer, localX, localY, event) {
            this.nextScene()
        }, this)

    }

    titleTextUpdate(tween, counter, texts, tintColors) {
        for (var i = 0; i < texts.length; i++) {
            let text = texts[i]
            text.setTint(tintColors[Math.floor(counter.value)].color)
        }
    }

    scoreTextUpdate(tween, counter, texts, tintColors) {
        for (var i = 0; i < texts.length; i++) {
            let text = texts[i]
            text.setTint(tintColors[Math.floor(counter.value)].color)
        }
    }

    nextScene() {
        // this.introMusic.stop();
        this.scene.start('TitleScene');
        // this.scene.start('TestScene');
    }

    update() {
    }

}
