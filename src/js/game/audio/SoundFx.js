class SoundFx {

    constructor() {
        this.sound = Phaser.Sound.SoundManagerCreator.create(game)
    }

    play(name) {
        this.sound.play("fx-" + name, { volume: 0.75, loop: false } )
    }

}