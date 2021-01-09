// Update frequency table.
export default function freqTable() {
    const main = this;
    const maxProportion = d3.max(this.containers.freqTable.tr.data(), (d) => d.proportion);
    this.containers.freqTable.tr.each(function (d) {
        const relativeProportion = d.proportion / maxProportion;
        const relativeProportionFmt = d3.format('.1%')(relativeProportion);
        const tr = d3.select(this);
        tr.selectAll('td')
            .data(d.cells)
            .join('td')
            .style('background', (di, i) =>
                i === 1 && main.settings.freqTable.bars
                    ? `linear-gradient(to right, var(--background-darkest) 0, var(--background-darkest) ${relativeProportionFmt}, transparent ${relativeProportionFmt})`
                    : null
            )
            .text((d) => d);
    });
}
