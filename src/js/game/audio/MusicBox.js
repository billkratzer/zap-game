class MusicBox {

    constructor() {
        this.sound = Phaser.Sound.SoundManagerCreator.create(game)
    }

    play(name) {
        this.sound.stopAll()
        //this.sound.play("music-" + name, { volume: 0.5, loop: true } )
    }

    stop() {
        this.sound.stopAll()
    }

}