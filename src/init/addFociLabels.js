export default function addFociLabels() {
    const fdg = this;

    // Event labels
    const text = this.svg
        .selectAll('text.actlabel')
        .data(this.eventTypes)
        .enter()
        .append('text')
        .attr('class', 'actlabel')
        .attr('x', (d) => d.x)
        .attr('y', (d) => d.y + (d.order ? 35 : 0));

    const label = text
        .append('tspan')
        .attr('x', (d) => d.x)
        .attr('text-anchor', 'middle')
        .text((d) => d.label);

    const pct = text
        .append('tspan')
        .classed('actpct', true)
        .attr('x', (d) => d.x)
        .attr('text-anchor', 'middle')
        .attr('dy', '1.3em')
        .text((d) => d3.format('%')(d.count / this.data.nested.length));

    return text;
}
