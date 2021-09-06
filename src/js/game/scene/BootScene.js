class BootScene extends Phaser.Scene {

    constructor () {
        super({ key: 'BootScene' });
        console.log("Phaser Version: " + Phaser.VERSION);
    }

    loadAudio(name) {
        // return this.load.audio(name, [
        //     "/assets/audio/" + name + ".ogg",
        //     "/assets/audio/" + name + ".mp3"
        // ]);
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

        // Particle Images
        this.loadParticleImage("red")
        this.loadParticleImage("green")
        this.loadParticleImage("blue")
        this.loadParticleImage("white")
        this.loadParticleImage("yellow")
    }

    create () {

        let camera = this.cameras.main

        globals.state = new GameState()
        globals.coords = new ScreenCoords(camera.width, camera.height, globals.state.BOARD_WIDTH, globals.state.BOARD_HEIGHT)
        globals.colors = new ColorFactory()

        globals.temp = {}

        // this.scene.start('GameScene');
        // this.scene.start('NewHighScoreScene');
        // this.scene.start('TestScene');
        this.scene.start('TitleScene');
    }

    update() {

    }

}
