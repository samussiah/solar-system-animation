export default function colorSizeToggle() {
    const fdg = this;

    const container = this.controls.append('div').classed('fdg-control fdg-control--color-size', true);
    const inputs = container
        .selectAll('div')
        .data(['color', 'size', 'both'])
        .enter()
        .append('div')
        .attr(
            'class',
            (d) => `togglebutton ${d} ${d === this.settings.quantifyEvents ? 'current' : ''}`
        )
        .text((d) => d);
    inputs.on('click', function (d) {
        inputs.classed('current', (di) => di === d);
        fdg.settings.quantifyEvents = d;
        fdg.colorLegend.classed('fdg-hidden', d === 'size');
        fdg.sizeLegend.classed('fdg-hidden', d === 'color');
    });

    return {
        container,
        inputs,
    };
}
