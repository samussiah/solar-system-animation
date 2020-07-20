export default function addFociLabels() {
    const fdg = this;

    // Event labels
    const text = this.svg
        .selectAll('text.actlabel')
        .data(this.metadata.event)
        .enter()
        .append('text')
        .attr('class', 'actlabel')
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y + 35);

    const label = text
        .append('tspan')
        .attr('x', (d) => d.x)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .style('font-size', '20px')
        .text((d) => d.value);

    const pct = text
        .append('tspan')
        .classed('actpct', true)
        .classed('fdg-hidden', this.settings.eventCount === false)
        .attr('x', (d) => d.x)
        .attr('text-anchor', 'middle')
        .attr('dy', '1.3em')
        .style('font-weight', 'bold')
        .text((d) => `${d.count} (${d3.format('%')(d.count / this.data.nested.length)})`);

    return text;
}
