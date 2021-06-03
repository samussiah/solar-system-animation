export default function legendTable(label, domain) {
    const container = this.legends.container.append('div');

    // Add table element.
    container.table = container.append('table');

    // Add header row.
    container.header = container.table
        .append('thead')
        .append('tr')
        .selectAll('th')
        .data([label, 'n'])
        .join('th')
        .attr('class', (d, i) => (i === 0 ? 'fdg-sidebar__label fdg-legend__label' : null))
        .attr('colspan', (d, i) => (i === 0 ? 2 : null))
        .style('text-align', (d, i) => (i === 0 ? 'left' : 'right'))
        .html((d) => d);

    // Add body rows.
    container.rows = container.table.append('tbody').selectAll('tr').data(domain).join('tr');

    // Add labels to second cell of each row.
    container.labels = container.rows.append('td')
        .style('padding-left', `${this.legends.svgWidth / 2 - this.legends.radius}px`)
        .html((d) => d);

    // Add SVG elements to first cell of each row.
    container.symbols = container.rows
        .append('td')
        .append('svg')
        .style('width', this.legends.svgWidth)
        .style('height', this.legends.svgHeight)
        .append('g')
        .attr('transform', 'translate(0,2)');

    // Add counts to third cell of each row.
    container.counts = container.rows.append('td');

    return container;
}
