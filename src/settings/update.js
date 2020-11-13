// TODO: setting checks
export default function update() {
    if (!['frequency', 'continuous', 'categorical'].includes(this.settings.colorBy.type)) {
        alert(
            `[ ${colorBy} ] is not a valid option.  Please choose one of [ frequency ], [ continuous ], or [ categorical ].  Defaulting to  [ frequency ].`
        );
        this.settings.colorBy.type = 'frequency';
    }

    // Define array of modal text.
    let texts = [];

    if (Array.isArray(this.settings.explanation)) {
        // Update explanation text with appropriate shape.
        this.settings.explanation = this.settings.explanation.map((text) =>
            text.replace(/bubble/g, this.settings.shape)
        );

        texts = texts.concat(
            this.settings.explanation.filter(
                (el) => !(this.settings.hideControls && el.includes('controls'))
            )
        );
    }

    if (Array.isArray(this.settings.information)) texts = texts.concat(this.settings.information);

    this.settings.text = texts.filter((text) => typeof text === 'string');
}
