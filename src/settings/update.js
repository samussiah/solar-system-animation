export default function update() {
    // Define array of modal text.
    this.settings.text = []
        .concat(
            this.settings.explanation.filter(
                (el) => !(this.settings.hideControls && el.includes('controls'))
            )
        )
        .concat(this.settings.information)
        .filter((text) => typeof text === 'string');
}
