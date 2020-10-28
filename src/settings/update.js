export default function update() {
    // Update explanation text with appropriate shape.
    this.settings.explanation = this.settings.explanation.map((text) =>
        text.replace(/bubble/g, this.settings.shape)
    );

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
