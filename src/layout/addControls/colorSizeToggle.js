export default function colorSizeToggle() {
    const fdg = this;

    const container = this.controls.container
        .append('div')
        .classed('fdg-control fdg-control--color-size', true);
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
        fdg.legends.selectAll('.fdg-legend').classed('fdg-hidden', function () {
            return !Array.from(this.classList).some((value) => value.includes(d));
        });
    });

    return {
        container,
        inputs,
    };
}
