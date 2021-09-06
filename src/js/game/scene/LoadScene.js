class LoadScene extends Phaser.Scene {

    constructor () {
        super({ key: 'LoadScene' });
    }

    loadMusic(name) {
        return this.load.audio("music-" + name, "asset/audio/music/" + name + ".mp3")
    }

    loadFx(name) {
        return this.load.audio("fx-" + name, "asset/audio/fx/" + name + ".mp3")
    }

    loadFont(name) {
        return this.load.bitmapFont(name,
            "./asset/font/" + name + ".png",
            "./asset/font/" + name + ".xml"
        );
    }

    loadImage(name) {
        return this.load.image(name, "./asset/image/" + name + ".png")
    }

    loadParticleImage(name) {
        return this.load.image("particle-" + name, "./asset/image/particle/" + name + ".png")
    }

    preload () {

        this.cameras.main.setBackgroundColor(0x000000)
        let screenWidth = this.cameras.main.width
        let screenHeight = this.cameras.main.height

        let graphics1 = this.add.graphics();
        let graphics2 = this.add.graphics();

        let barWidth = screenWidth * 0.80
        let barHeight = 50

        console.log("bar width: " + barWidth)

        let barX = (screenWidth - barWidth) / 2
        let barY = (screenHeight - barHeight ) / 2

        let inset = 2

        let progressBar = new Phaser.Geom.Rectangle(barX, barY, barWidth, barHeight);
        let progressBarFill = new Phaser.Geom.Rectangle(barX + inset, barY + inset, barWidth - inset * 2, barHeight - inset * 2);

        graphics1.fillStyle(0xcccccc, 1);
        graphics1.fillRectShape(progressBar);

        graphics2.fillStyle(0x555555, 1);
        graphics2.fillRectShape(progressBarFill);

        let loadingText = this.add.text(screenWidth * 0.50, barY + barHeight + 10, "Loading: ", { fontFamily:"sans-serif", fontSize: '24px', fill: '#fff' })
            .setOrigin(0.5, 0)

        // Fonts
        this.loadFont("points-font")
        this.loadFont("game-font")
        this.loadFont("game-over-font")
        this.loadFont("helvetica-neue-white-32")
        this.loadFont("helvetica-neue-thin-gray-24")
        this.loadFont("kanit-32-thin")
        this.loadFont("kanit-32-medium")
        this.loadFont("kanit-64-semibold")
        this.loadFont("kanit-96-glow")

        // Sprites
        this.load.spritesheet("sprites-1", "./asset/image/sprite-sheet-1.png",
            { frameWidth: 16, frameHeight: 16 }
        )
        this.load.spritesheet("sprites-2", "./asset/image/sprite-sheet-2.png",
            { frameWidth: 16, frameHeight: 16 }
        )
        this.load.spritesheet("sprites-3", "./asset/image/sprite-sheet-3.png",
            { frameWidth: 16, frameHeight: 16 }
        )

        // Images
        this.loadImage("zap-title-text")

        this.loadImage("vertical-fire")
        this.loadImage("horizontal-fire")

        // Particle Images
        this.loadParticleImage("red")
        this.loadParticleImage("green")
        this.loadParticleImage("blue")
        this.loadParticleImage("white")
        this.loadParticleImage("yellow")

        // Music
        this.loadMusic("cool-puzzler")
        this.loadMusic("desert-mayhem")
        this.loadMusic("funky-runnin")

        this.loadFx("explosion-1")
        this.loadFx("ui-quirky-9")
        this.loadFx("ui-quirky-31")
        this.loadFx("ui-quirky-33")

        globals.music = new MusicBox()
        globals.soundfx = new SoundFx()


        this.load.on('progress', this.updateBar, {
            graphics: graphics2,
            text: loadingText,
            bar: {
                x: barX,
                y: barY,
                width: barWidth,
                height: barHeight,
                inset: inset
            }
        });
        this.load.on('complete', this.complete);
    }


    updateBar1(percentage) {
        console.log("P:" + percentage);
    }

    updateBar(percentage) {
        this.graphics.clear();
        this.graphics.fillStyle(0x555555, 1);

        this.graphics.fillRectShape(
            new Phaser.Geom.Rectangle(
                this.bar.x + this.bar.inset,
                this.bar.y + this.bar.inset,
                percentage * (this.bar.width - this.bar.inset * 2),
                this.bar.height - this.bar.inset * 2)
        )

        percentage = percentage * 100
        this.text.setText("Loading: " + percentage.toFixed(0) + "%");
    }

    complete() {
        console.log("COMPLETE!");
    }

    create () {
        this.scene.start('TitleScene');
        //this.scene.start('TestScene');
    }

    update() {
    }

}
