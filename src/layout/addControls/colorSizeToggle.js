import { increment as redraw } from '../../init/startInterval';

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
            (d) =>
                `fdg-button ${d} ${d === this.settings.eventChangeCountAesthetic ? 'current' : ''}`
        )
        .attr(
            'title',
            (d) =>
                `Quantify the number of ${fdg.util.csv(this.settings.eventChangeCount)} events by ${
                    d !== 'both' ? d : 'color and size'
                }`
        )
        .text((d) => d);

    inputs.on('click', function (d) {
        inputs.classed('current', (di) => di === d);
        fdg.settings.eventChangeCountAesthetic = d;

        // Update tooltips of event list toggles.
        fdg.controls.eventList.inputs.attr(
            'title',
            (d) =>
                `${fdg.settings.eventChangeCount.includes(d.value) ? 'Remove' : 'Add'} ${d.value} ${
                    fdg.settings.eventChangeCount.includes(d.value) ? 'from' : 'to'
                } the list of events that control bubble ${
                    fdg.settings.eventChangeCountAesthetic === 'both'
                        ? 'color and size'
                        : fdg.settings.eventChangeCountAesthetic
                }.`
        );

        // Update legends.
        fdg.legends.container.selectAll('.fdg-legend').classed('fdg-hidden', function () {
            return !Array.from(this.classList).some((value) => value.includes(d));
        });

        redraw.call(fdg, false);
    });

    return {
        container,
        inputs,
    };
}
