class TitleScene extends Phaser.Scene {

    constructor () {
        super({ key: 'TitleScene' });
    }

    preload () {
    }

    create () {
        console.log("TitleScreen.create()")

        let camera = this.cameras.main

        let titleImage = this.add.image(0, camera.centerY / 1.8, 'zap-title-text')
        titleImage.x = 0 - titleImage.width / 2

        this.tweens.add({
            targets: titleImage,
            x: camera.centerX,
            duration: 1000,
            ease: 'Back',
            easeParams: [ 3.5 ],
            delay: 1000
        });

        let authorText = this.add.bitmapText(0, 0, 'helvetica-neue-thin-gray-24', 'By Bill Kratzer & Tayler Ramsay', 24)
        authorText.setOrigin(0.5, 0.5)
        authorText.setPosition(camera.width + authorText.width, camera.centerY * 1.1)

        this.tweens.add({
            targets: authorText,
            x: camera.centerX,
            duration: 1000,
            ease: 'Back',
            easeParams: [ 3.5 ],
            delay: 1000
        });

        let pressText = this.add.bitmapText(0, 0, 'helvetica-neue-white-32', 'Press Any Key to Start!', 32)
        pressText.setOrigin(0.5, 0.5)
        pressText.setPosition(camera.centerX, camera.height + pressText.height)

        this.tweens.add({
            targets: pressText,
            y: camera.centerY * 1.4,
            duration: 1000,
            ease: 'Back',
            easeParams: [ 3.5 ],
            delay: 1000
        });

        let padding = 5;
        let copyrightText = this.add.text(padding, camera.height - padding, 'Copyright (c) 2021 Loud Shirt Studios')
            .setFontFamily('Helvetica')
            .setFontSize(12)
            .setColor('#aaa')
            .setOrigin(0, 1)

        let versionText = this.add.text(camera.width - padding, camera.height - padding, 'Version: ' + globals.version)
            .setFontFamily('Helvetica')
            .setFontSize(12)
            .setColor('#aaa')
            .setOrigin(1, 1)


        this.input.on('pointerup', function(pointer, localX, localY, event) {
            this.nextScene();
        }, this);

        this.input.keyboard.on('keydown', function(pointer, localX, localY, event) {
            this.nextScene();
        }, this);

    }

    nextScene() {
        // this.introMusic.stop();
        this.scene.start('GameScene');
    }

    update() {

    }

}
