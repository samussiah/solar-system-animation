export default function addSpeedControl() {
    const fdg = this;

    const container = this.controls.append('div').classed('fdg-control fdg-control--speed', true);
    const inputs = container
        .selectAll('div')
        .data(
            Object.keys(this.settings.speeds).map((key) => {
                return { label: key, value: this.settings.speeds[key] };
            })
        )
        .enter()
        .append('div')
        .attr(
            'class',
            (d) => `togglebutton ${d.label} ${d.label === this.settings.speed ? 'current' : ''}`
        )
        .text((d) => d.label);
    inputs.on('click', function (d) {
        inputs.classed('current', (di) => di.label === d.label);
        fdg.settings.speed = d.label;
    });

    return {
        container,
        inputs,
    };
}
