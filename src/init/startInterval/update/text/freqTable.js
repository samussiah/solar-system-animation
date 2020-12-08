// Update frequency table.
export default function freqTable() {
    this.freqTable.tr.each(function (d) {
        const tr = d3.select(this);
        tr.selectAll('td')
            .data(d.cells)
            .join('td')
            .style('background', (di, i) =>
                i === 1
                    ? `linear-gradient(to right, #bbb 0, #bbb ${d.proportionFmt}, transparent ${d.proportionFmt})`
                    : null
            )
            .text((d) => d);
    });
}
