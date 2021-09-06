class ColorFactory {

    constructor() {
        this.palettes = {}

        this.palettes.rainbow = this.buildRainbowPalette()

        this.themes = []
        this.buildThemes()
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

    colorFromHex(hex) {
        return Phaser.Display.Color.HexStringToColor(hex)
    }

    buildThemes() {
        this.buildTheme("default", {
            background: this.colorFromHex("#333"),
            dots: this.colorFromHex("#fff"),
            pit1: this.colorFromHex("#ff00ff"),
            pit2: this.colorFromHex("#ff44ff"),
            pit3: this.colorFromHex("#ff88ff"),
            pit4: this.colorFromHex("#ffbbff"),
            text: this.colorFromHex("#fff"),
        })
    }

    buildTheme(key, colors) {
        this.themes[key] = colors
    }

    getTheme(key) {
        return this.themes[key]
    }

}