// TODO: setting checks
export default function update() {
    // aesthetics
    if (!['frequency', 'continuous', 'categorical', null].includes(this.settings.colorBy.type)) {
        alert(
            `[ '${this.settings.colorBy.type}' ] is not a valid [ colorBy.type ] setting.  Please choose one of [ 'frequency' ], [ 'continuous' ], or [ 'categorical' ].  Defaulting to  [ 'frequency' ].`
        );
        this.settings.colorBy.type = 'frequency';
    }
    if (!['frequency', 'continuous', null].includes(this.settings.sizeBy.type)) {
        alert(
            `[ '${this.settings.sizeBy.type}' ] is not a valid [ sizeBy.type ] setting.  Please choose one of [ 'frequency' ] or [ 'continuous' ].  Defaulting to  [ 'frequency' ].`
        );
        this.settings.sizeBy.type = 'frequency';
    }
    if (!['categorical', null].includes(this.settings.shapeBy.type)) {
        alert(
            `[ '${this.settings.shapeBy.type}' ] is not a valid [ shapeBy.type ] setting.  Please choose [ 'categorical' ].  Defaulting to  [ null ].`
        );
        this.settings.shapeBy.type = null;
    }

    this.settings.stratify = this.settings.colorBy.type === 'categorical';
    this.settings.colorify = this.settings.colorBy.type !== null;
    this.settings.sizify =
        this.settings.sizeBy.type === 'frequency' ||
        (this.settings.sizeBy.type === 'continuous' && this.settings.sizeBy.variable !== null);
    this.settings.shapify = this.settings.shapeBy.variable !== null;

    // freq table
    // TODO: add bars to horizontal table view
    if (this.settings.freqTable.structure === 'horizontal' && !this.settings.stratify)
        this.settings.freqTable.structure = 'vertical';
    if (this.settings.freqTable.structure === 'horizontal') this.settings.freqTable.bars = false;

    // Define array of modal text.
    let texts = [];

    if (Array.isArray(this.settings.explanation)) {
        // Update explanation text depending on aesthetics.
        this.settings.explanation = this.settings.explanation.map((text) => {
            // event count type
            text = text.replace(
                '[event-count-type]',
                this.settings.eventCountType === 'current-id'
                    ? 'number of individuals currently experiencing the event'
                    : this.settings.eventCountType === 'cumulative-id'
                    ? 'number of individuals who have ever experienced the event'
                    : 'total number of events'
            );

            // frequency aesthetic
            if (/\[frequency-aesthetic]/.test(text)) {
                if (
                    this.settings.colorBy.type === 'frequency' &&
                    this.settings.sizeBy.type === 'frequency'
                )
                    text = text.replace('[frequency-aesthetic]', 'color and size');
                else if (this.settings.colorBy.type === 'frequency')
                    text = text.replace('[frequency-aesthetic]', 'color');
                else if (this.settings.sizeBy.type === 'frequency')
                    text = text.replace('[frequency-aesthetic]', 'size');
                else text = null;
            }

            return text;
        });

        texts = texts.concat(
            this.settings.explanation.filter(
                (el) => el !== null && !(this.settings.hideControls && el.includes('controls'))
            )
        );
    }

    if (Array.isArray(this.settings.information)) texts = texts.concat(this.settings.information);

    this.settings.text = texts.filter((text) => typeof text === 'string');

    // sequences
    if (this.settings.sequences) {
        this.settings.loop = false;
        this.settings.runSequences = true;
        this.settings.animationTrack = 'sequence';
        this.settings.sequences.forEach((sequence) => {
            sequence.eventIndex = 0;
        });
    } else {
        this.settings.runSequences = false;
        this.settings.animationTrack = 'full';
    }
}
