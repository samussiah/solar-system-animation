import toggle from './playPause/toggle';
import startInterval from '../../../init/startInterval';

export default function speed() {
    const main = this;

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
            (d) =>
                `fdg-button ${d.label} ${
                    d.label === this.settings.speed ? 'fdg-button--current' : ''
                }`
        )
        .attr(
            'title',
            (d) => `Advance the animation every ${this.settings.speeds[d.label] / 1000} second(s).`
        )
        .text((d) => d.label);
    inputs.on('click', function (d) {
        main.settings.speed = d.label;
        inputs.classed('fdg-button--current', (di) => di.label === d.label);
        if (main.settings.playPause === 'play') {
            if (!!main.interval) main.interval.stop();
            main.interval = startInterval.call(
                main,
                main.sequence ? main.sequence.data : main.data
            );
        }
    });

    return {
        container,
        inputs,
    };
}
