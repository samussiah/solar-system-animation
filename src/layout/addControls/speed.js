import startInterval from '../../init/startInterval';

export default function speed() {
    const fdg = this;

    const container = this.controls.container
        .append('div')
        .classed('fdg-control fdg-control--speed', true);
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
        .attr(
            'title',
            (d) => `Advance the animation every ${this.settings.speeds[d.label] / 1000} second(s).`
        )
        .text((d) => d.label);
    inputs.on('click', function (d) {
        fdg.settings.speed = d.label;
        inputs.classed('current', (di) => di.label === d.label);
        fdg.interval.stop();
        fdg.interval = startInterval.call(fdg);
    });

    return {
        container,
        inputs,
    };
}
