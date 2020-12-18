// Update frequency table.
export default function freqTable() {
    const maxProportion = d3.max(this.freqTable.tr.data(), (d) => d.proportion);
    this.freqTable.tr.each(function (d) {
        const relativeProportion = d.proportion / maxProportion;
        const relativeProportionFmt = d3.format('.1%')(relativeProportion);
        const tr = d3.select(this);
        tr.selectAll('td')
            .data(d.cells)
            .join('td')
            .style('background', (di, i) =>
                i === 1
                    ? `linear-gradient(to right, #bbb 0, #bbb ${relativeProportionFmt}, transparent ${relativeProportionFmt})`
                    : null
            )
            .text((d) => d);
    });
}