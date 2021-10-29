import legendTable from '../legendTable';

export default function categorical() {
    const container = legendTable.call(
        this,
        this.settings.colorBy.label,
        this.scales.color.domain()
    );

    // Draw symbols
    container.symbols
        .append('circle')
        .attr('cx', this.legends.svgWidth / 2)
        .attr('cy', this.legends.svgHeight / 2)
        .attr('r', this.legends.radius)
        .attr('fill', (d) => this.scales.color(d));

    // Update counts.
    container.counts.text((d) =>
        d3.format(',d')(this.metadata.id.filter((di) => di.colorStratum === d).length)
    );

    return container;
}
