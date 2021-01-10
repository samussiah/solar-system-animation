export default function defineCellValues(d) {
    const cells = this.settings.freqTable.structure === 'vertical'
        ? [d.label, d.fmt.idNumeratorPercent, d.fmt.eventNumerator]
        : [
                d.label,
                this.settings.freqTable.countType === 'id'
                    ? d.fmt.idNumeratorPercent
                    : d.fmt.eventNumerator,
                ...(d.foci
                        ? d.foci.map((focus) => this.settings.freqTable.countType === 'id'
                            ? focus.fmt.idNumeratorPercent
                            : focus.fmt.eventNumeratorPercent)
                        : []
                ),
            ];

    return cells;
}
