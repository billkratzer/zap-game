class SplashScene extends Phaser.Scene {

    constructor () {
        super({ key: 'SplashScene' });
    }

    preload () {
    }

    create () {
        var textLoading = this.add.text(
            512,
            300,
            "Loading...",
            { fontFamily: 'Arial', fontSize: 24, color: '#eee' }
        );
        textLoading.setOrigin(0.5, 0.5);

        this.scene.start('BootScene');
    }

    update() {

    }

}