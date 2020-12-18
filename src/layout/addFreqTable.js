export default function addFreqTable() {
    const main = this;

    const freqTable = {
        container: this.containers.freqTable.classed('fdg-hidden', this.settings.hideFreqTable),
    };

    freqTable.table = freqTable.container.append('table').classed('fdg-freq-table__table', true);
    freqTable.thead = freqTable.table.append('thead').classed('fdg-freq-table__thead', true);
    freqTable.th = freqTable.thead
        .selectAll('th')
        .data(['', 'Participants', 'Events'])
        .join('th')
        .attr(
            'class',
            (d, i) =>
                `fdg-freq-table__th--${
                    i === 0 ? 'label' : i === 1 ? 'participant' : i === 2 ? 'event' : i
                }`
        )
        .classed('fdg-freq-table__th', true)
        .text((d) => d);
    freqTable.th
        .filter((d) => d === 'Participants')
        .html(
            (d) =>
                `${d} <span ${`class = 'fdg-info-icon'`} ${
                    this.settings.colorBy.type === 'categorical'
                        ? `title = 'Gray background represents the percentage of individuals in the given group at the given state'`
                        : `title = 'Gray background represents the percentage of individuals at the given state'`
                }>&#9432;</span>`
        );
    freqTable.tbody = freqTable.table.append('tbody').classed('fdg-freq-table__tbody', true);
    freqTable.tr = freqTable.tbody
        .selectAll('tr')
        .data(
            this.data.freqTable.filter(
                (d) =>
                    !(
                        this.settings.eventCentralInFreqTable === false &&
                        d.state === this.settings.eventCentral
                    )
            )
        )
        .join('tr')
        .attr('class', (d) => (d.state !== d.value ? 'fdg-freq-table__tr--subgroup' : null))
        .classed('fdg-freq-table__tr', true)
        .style('font-size', (d) => (d.group !== d.value ? '1rem' : '1.25rem'));
    freqTable.tr.each(function (d, i) {
        const tr = d3.select(this);
        const td = tr
            .selectAll('td')
            .data((di) => d.cells)
            .join('td')
            .attr(
                'class',
                (d, i) =>
                    `fdg-freq-table__td--${
                        i === 0 ? 'label' : i === 1 ? 'participant' : i === 2 ? 'event' : i
                    }`
            )
            .classed('fdg-freq-table__td', true)
            .style('background', (di, i) =>
                i === 1
                    ? `linear-gradient(to right, #bbb 0, #bbb ${d.proportionFmt}, transparent ${d.proportionFmt})`
                    : null
            ) // add background to participant cell proportional to the percentage of participants at state or focus
            .text((di) => (typeof di === 'number' ? d3.format(',d')(di) : di));
    });
    freqTable.td = freqTable.tr.selectAll('td');

    return freqTable;
}
