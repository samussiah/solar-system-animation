import { increment as redraw } from '../../init/startInterval';

export default function eventList() {
    const fdg = this;

    const container = this.controls.container
        .append('div')
        .classed('fdg-control fdg-control--event-list', true);
    const inputs = container
        .selectAll('div')
        .data(this.metadata.event)
        .enter()
        .append('div')
        .attr(
            'class',
            (d) => `fdg-button ${this.settings.eventChangeCount.includes(d.value) ? 'current' : ''}`
        )
        .attr(
            'title',
            (d) =>
                `${this.settings.eventChangeCount.includes(d.value) ? 'Remove' : 'Add'} ${
                    d.value
                } ${
                    this.settings.eventChangeCount.includes(d.value) ? 'from' : 'to'
                } the list of events that control bubble ${
                    this.settings.eventChangeCountAesthetic === 'both'
                        ? 'color and size'
                        : this.settings.eventChangeCountAesthetic
                }.`
        )
        .text((d) => d.value);

    inputs.on('click', function (d) {
        this.classList.toggle('current');

        // Update event array.
        if (fdg.settings.eventChangeCount.includes(this.textContent))
            fdg.settings.eventChangeCount.splice(
                fdg.settings.eventChangeCount.findIndex((event) => event === this.textContent),
                1
            );
        else fdg.settings.eventChangeCount.push(this.textContent);

        // Update tooltip.
        this.title = `${fdg.settings.eventChangeCount.includes(d.value) ? 'Remove' : 'Add'} ${
            d.value
        } ${
            fdg.settings.eventChangeCount.includes(d.value) ? 'from' : 'to'
        } the list of events that control bubble ${
            fdg.settings.eventChangeCountAesthetic === 'both'
                ? 'color and size'
                : fdg.settings.eventChangeCountAesthetic
        }.`;

        // Update color-size toggle.
        fdg.controls.colorSizeToggle.inputs.attr(
            'title',
            (di) =>
                `Quantify the number of ${fdg.util.csv(fdg.settings.eventChangeCount)} events by ${
                    di !== 'both' ? di : 'color and size'
                }.`
        );

        // Update legend label.
        fdg.legends.container
            .classed('fdg-invisible', fdg.settings.eventChangeCount.length === 0)
            .selectAll('span.fdg-measure')
            .text(fdg.util.csv(fdg.settings.eventChangeCount));

        redraw.call(fdg, false);
    });

    return {
        container,
        inputs,
    };
}
