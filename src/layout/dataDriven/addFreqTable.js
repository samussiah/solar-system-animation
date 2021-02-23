export default function addFreqTable() {
    const main = this;

    const freqTable = {
        container: this.layout.freqTable
            .classed('fdg-hidden', this.settings.freqTable.display === false)
            .classed('fdg-freq-table--vertical', this.settings.freqTable.structure === 'vertical')
            .classed(
                'fdg-freq-table--horizontal',
                this.settings.freqTable.structure === 'horizontal'
            ),
    };

    freqTable.label = this.util
        .addElement('freq-table__label', freqTable.container)
        .classed('fdg-sidebar__label', true)
        .text(
            this.settings.freqTable.structure === 'vertical'
                ? ''
                : this.settings.freqTable.countType === 'id'
                ? 'Number of Individuals'
                : 'Number of Events'
        );
    freqTable.table = freqTable.container.append('table').classed('fdg-freq-table__table', true);
    freqTable.thead = freqTable.table.append('thead').classed('fdg-freq-table__thead', true);

    // Add column headers.
    freqTable.th = freqTable.thead
        .selectAll('th')
        .data(
            this.settings.freqTable.structure === 'vertical'
                ? ['', 'Individuals', 'Events']
                : ['', 'Total', ...this.metadata.strata.map((stratum) => stratum.key)]
        )
        .join('th')
        .attr(
            'class',
            (d, i) =>
                `fdg-freq-table__th--${
                    i === 0 ? 'label' : i === 1 ? 'individual' : i === 2 ? 'event' : i
                }`
        )
        .classed('fdg-freq-table__th', true)
        .text((d) => d);

    // Add info icon explaining bars.
    if (this.settings.freqTable.bars)
        freqTable.th
            .filter((d) => d === 'Individuals')
            .html(
                (d) =>
                    `${d} <span ${`class = 'fdg-info-icon'`} ${
                        this.settings.colorBy.type === 'categorical'
                            ? `title = 'Gray background represents the percentage of individuals in the given group at the given state'`
                            : `title = 'Gray background represents the percentage of individuals at the given state'`
                    }>&#9432;</span>`
            );

    freqTable.tbody = freqTable.table.append('tbody').classed('fdg-freq-table__tbody', true);

    // Add table rows.
    freqTable.tr = freqTable.tbody
        .selectAll('tr')
        .data(
            this.data.freqTable.filter(
                (d) =>
                    !(
                        this.settings.freqTable.includeEventCentral === false &&
                        d.state === this.settings.eventCentral
                    ) && !(this.settings.freqTable.structure === 'horizontal' && !d.foci) // exclude central event row(s) // exclude strata rows
            )
        )
        .join('tr')
        .attr('class', (d) => (d.state !== d.label ? 'fdg-freq-table__tr--subgroup' : null))
        .classed('fdg-freq-table__tr', true)
        .style('font-size', (d) => (d.group !== d.value ? '1rem' : '1.25rem'));

    // Add table cells.
    freqTable.tr.each(function (d, i) {
        const tr = d3.select(this);
        const td = tr
            .selectAll('td')
            .data((di) => d.cells)
            .join('td')
            .attr('class', (d, i) =>
                main.settings.freqTable.structure === 'vertical'
                    ? `fdg-freq-table__td--${
                          i === 0 ? 'label' : i === 1 ? 'individual' : i === 2 ? 'event' : i
                      }`
                    : `fdg-freq-table__td--${i === 0 ? 'label' : 'freq'}`
            )
            .classed('fdg-freq-table__td', true)
            .style('background', (di, i) =>
                i === 1 && main.settings.freqTable.bars
                    ? `linear-gradient(to right, var(--background-darkest) 0, var(--background-darkest) ${d.proportionFmt}, transparent ${d.proportionFmt})`
                    : null
            ) // add background to individual cell proportional to the percentage of individuals at state or focus
            .text((di) => (typeof di === 'number' ? d3.format(',d')(di) : di));
    });
    freqTable.td = freqTable.tr.selectAll('td');

    return freqTable;
}
