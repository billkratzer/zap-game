class BootScene extends Phaser.Scene {

    constructor () {
        super({ key: 'BootScene' });
        console.log("Phaser Version: " + Phaser.VERSION);
    }

    preload() {
        this.splash = this.add.image("splash.png")
    }


    create () {
        let camera = this.cameras.main


        globals.state = new GameState()
        globals.coords = new ScreenCoords(camera.width, camera.height, globals.state.BOARD_WIDTH, globals.state.BOARD_HEIGHT)
        globals.colors = new ColorFactory()
        globals.emitter = new Phaser.Events.EventEmitter()

        globals.temp = {}

        globals.music = new MusicBox()
        globals.soundfx = new SoundFx()

        this.scene.start('LoadScene');
    }

    update() {
    }

}
