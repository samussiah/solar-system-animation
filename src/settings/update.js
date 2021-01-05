// TODO: setting checks
export default function update() {
    // aesthetics
    if (!['frequency', 'continuous', 'categorical'].includes(this.settings.colorBy.type)) {
        alert(
            `[ '${this.settings.colorBy.type}' ] is not a valid [ colorBy.type ] setting.  Please choose one of [ 'frequency' ], [ 'continuous' ], or [ 'categorical' ].  Defaulting to  [ 'frequency' ].`
        );
        this.settings.colorBy.type = 'frequency';
    }
    if (!['frequency', 'continuous'].includes(this.settings.sizeBy.type)) {
        alert(
            `[ '${this.settings.sizeBy.type}' ] is not a valid [ sizeBy.type ] setting.  Please choose one of [ 'frequency' ] or [ 'continuous' ].  Defaulting to  [ 'frequency' ].`
        );
        this.settings.sizeBy.type = 'frequency';
    }
    if (!['categorical'].includes(this.settings.shapeBy.type)) {
        alert(
            `[ '${this.settings.shapeBy.type}' ] is not a valid [ shapeBy.type ] setting.  Please choose [ 'categorical' ].  Defaulting to  [ null ].`
        );
        this.settings.shapeBy.type = null;
    }

    this.settings.stratify = this.settings.colorBy.type === 'categorical';
    this.settings.sizify =
        this.settings.sizeBy.type === 'frequency' ||
        (this.settings.sizeBy.type === 'continuous' && this.settings.sizeBy.variable !== null);
    this.settings.shapify = this.settings.shapeBy.variable !== null;

    // freq table
    // TODO: add bars to horizontal table view
    if (this.settings.freqTable.structure === 'horizontal') this.settings.freqTable.bars = false;

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
