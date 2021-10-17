class NewHighScoreScene extends Phaser.Scene {

    constructor () {
        super({ key: 'NewHighScoreScene' });
    }

    preload () {
    }

    create () {
        console.log("HighScoreScene.create()")

        this.layers = {}
        this.layers.text = this.add.layer().setDepth(2)
        this.layers.mask = this.add.layer().setDepth(1)
        this.layers.fireworks = this.add.layer().setDepth(0)

        this.temp = {}
        this.temp.name = ""
        this.temp.allowInput = false
        this.temp.underscoreVisible = false
        this.temp.highScores = new HighScores()

        this.texts = {}

        let score = globals.state.score
        // score = 512000

        if (!this.temp.highScores.isHighScore(score)) {
            this.nextScene()
            return
        }

        globals.newHighScoreScene = {}
        globals.newHighScoreScene.rainbowWave = 0

        globals.temp.rainbow = shuffle(globals.colors.palettes.rainbow)


        let coords = globals.coords
        let screenWidth = coords.screenWidth
        let screenHeight = coords.screenHeight

        const FONT = "kanit-96-glow"
        //const FONT = "helvetica-neue-white-32"
        let congratsText = this.add.dynamicBitmapText(coords.getScreenFractionX(0.51), 0 - screenHeight, FONT, "CONGRATULATIONS!", 96)
            .setLetterSpacing(4)
            .setDisplayCallback(this.congratulationsTextCallback)
            .setOrigin(0.5, 0.5)

        let messageText = this.add.bitmapText(0 - screenWidth, screenHeight * 0.25, FONT, "YOU HAVE A HIGH SCORE!", 48)
            .setTint(0x6cc5ce)
            .setOrigin(0.5, 0.5)

        let scoreText = this.add.bitmapText(screenWidth * 2, screenHeight * 0.35, FONT, "#" + this.temp.highScores.getHighScoreRank(score) + "     " + score, 64)
            .setTint(0xfee71a)
            .setOrigin(0.5, 0.5)

        let enterText = this.add.bitmapText( screenWidth / 2, screenHeight * 2, "kanit-32-thin", "TYPE YOUR NAME AND PRESS [ENTER]", 32)
            .setOrigin(0.5, 0.5)

        let nameText = this.add.bitmapText( screenWidth / 2, coords.getScreenFractionY(0.62), FONT, "", 72)
            .setOrigin(0.5, 0.5)

        this.layers.text.add([congratsText, messageText, scoreText, enterText, nameText])

        this.texts.nameText = nameText

        this.tweens.add({
            targets: congratsText,
            y: coords.getScreenFractionY(.10),
            duration: 1000,
            ease: 'Back',
            easeParams: [ 0.5 ]
        });

        this.tweens.add({
            targets: messageText,
            x: coords.getScreenFractionX(.50),
            duration: 1000,
            ease: 'Back',
            easeParams: [ 0.5 ],
            delay: 1000
        });

        this.tweens.add({
            targets: scoreText,
            x: coords.getScreenFractionX(.50),
            duration: 1000,
            ease: 'Back',
            easeParams: [ 0.5 ],
            delay: 1000
        });

        this.tweens.add({
            targets: enterText,
            y: coords.getScreenFractionY(.50),
            duration: 1000,
            ease: 'Back',
            easeParams: [ 0.5 ],
            delay: 1000
        });

        let rect = this.add.rectangle(0, 0, screenWidth, screenHeight, 0x00000, 0.20)
            .setOrigin(0, 0)
        this.layers.mask.add(rect)

        this.buildFireWorks()

        // this.input.on('pointerup', function(pointer, localX, localY, event) {
        //     this.nextScene()
        // }, this)

        this.input.keyboard.on('keydown', this.keyDown, this)

        this.time.addEvent({
            delay: 1000,
            callback: function() {
                this.temp.allowInput = true
                this.temp.underscoreVisible = !this.temp.underscoreVisible
            },
            loop: true,
            callbackScope: this
        });

    }

    buildFireWorks() {

        var sparks = [
            this.add.particles('particle-red'),
            this.add.particles('particle-green'),
            this.add.particles('particle-blue'),
            this.add.particles('particle-yellow'),
            this.add.particles('particle-white')
        ]

        this.layers.fireworks.add(sparks)

        for (let i = 0; i < 20; i++) {
            var particles = sparks[i % sparks.length]

            let emitter = particles.createEmitter({
                x: globals.coords.getScreenFractionX(i/20),
                y: globals.coords.getScreenFractionY(0.13),
                speed: { min: -100, max: 500 },
                gravityY: 100,
                scale: { start: 0.4, end: 0.1 },
                lifespan: 600,
                blendMode: 'SCREEN'
            })

        }

    }

    congratulationsTextCallback(data) {
        // https://www.color-hex.com/color-palette/109407
        //let colors = [0x00aed9, 0x53da3f, 0xffe71a, 0xff983a, 0x000000, 0xff17a3]
        let colors = globals.temp.rainbow

        data.color = colors[ data.index % colors.length ].color

        let degrees = globals.newHighScoreScene.rainbowWave + data.index * 15
        degrees = degrees % 360

        let radians = degrees * Math.PI / 180.0
        data.y = data.y + Math.sin(radians) * 5;

        globals.newHighScoreScene.rainbowWave += 1;
        return data
    }

    keyDown(event) {

        // handle backspace and delete
        if ((event.code == "Delete") || (event.code == "Backspace")) {
            if (this.temp.name.length > 0) {
                this.temp.name = this.temp.name.substring(0, this.temp.name.length - 1);
            }
            return
        }

        // handle enter and return
        if ((event.code == "Enter") || (event.code == "Return")) {
            if (this.temp.name.length > 0) {
                this.temp.highScores.addHighScore(globals.state.score, this.temp.name)
                //highScores.addHighScore(512000, this.temp.name)
                this.nextScene()
                return
            }
        }

        // check for banned characters (that screw up encoding)
        let banned = ["\"", "'", ":"]
        if (banned.indexOf(event.key) > -1) {
            return
        }

        // append to the name if a valid character and if length is less than 20
        if ((event.key.length == 1) && (this.temp.name.length < 20)) {
            this.temp.name = this.temp.name + event.key.toUpperCase()
        }
    }


    nextScene() {
        this.scene.start('HighScoreScene');
    }

    update() {
        if (this.temp.name.length == 0) {
            if (this.temp.underscoreVisible) {
                this.texts.nameText.setText(this.temp.name + "_")
            }
            else {
                this.texts.nameText.setText(this.temp.name + " ")
            }
        }
        else {
            this.texts.nameText.setText(this.temp.name + "_")
        }
    }

}
