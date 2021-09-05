class ColorFactory {

    constructor() {
        this.palettes = {}

        this.palettes.rainbow = this.buildRainbowPalette()
    }

    buildRainbowPalette() {
        this.palettes.rainbow = []

        let palette = []

        palette.push(Phaser.Display.Color.HexStringToColor("#f02322"))
        palette.push(Phaser.Display.Color.HexStringToColor("#ff983a"))
        palette.push(Phaser.Display.Color.HexStringToColor("#fee71a"))
        palette.push(Phaser.Display.Color.HexStringToColor("#52d93f"))
        palette.push(Phaser.Display.Color.HexStringToColor("#6cc5ce"))
        palette.push(Phaser.Display.Color.HexStringToColor("#0286d9"))
        palette.push(Phaser.Display.Color.HexStringToColor("#6638f0"))
        palette.push(Phaser.Display.Color.HexStringToColor("#f764bd"))

        return palette
    }


}