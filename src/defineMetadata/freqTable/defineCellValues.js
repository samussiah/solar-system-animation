export default function defineCellValues(d) {
    const cells = [{
        key: 'label',
        label: '',
        value: d.label
    }];

    if (this.settings.freqTable.structure === 'vertical') {
        this.settings.freqTable.columns.forEach(column => {
            if (column === 'id')
                cells.push({
                    key: 'id',
                    label: this.settings.individualLabel,
                    value: d.fmt.idNumeratorPercent
                });
            if (column === 'event')
                cells.push({
                    key: 'event',
                    label: this.settings.evetLabel,
                    value: d.fmt.eventNumerator
                });
        });
    }
    // one column per stratum
    else {
        if (this.settings.freqTable.countType === 'id')
            cells.push({
                key: 'id',
                label: this.settings.individualLabel,
                value: d.fmt.idNumeratorPercent,
            });
        else
            cells.push({
                key: 'event',
                label: this.settings.eventLabel,
                value: d.fmt.eventNumerator
            });

        if (d.foci)
            d.foci.forEach(focus => {
                if (this.settings.freqTable.countType === 'id')
                    cells.push({
                        key: `id--${focus.key}`,
                        label: focus.key,
                        value: focus.fmt.idNumeratorPercent,
                    });
                else
                    cells.push({
                        key: `event--${focus.key}`,
                        label: focus.key,
                        value: focus.fmt.eventNumerator,
                    });
            });
    }

    return cells;
}
