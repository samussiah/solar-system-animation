import { increment as redraw } from '../../init/startInterval';

export default function eventList() {
    let container, inputs;

    if (this.settings.colorBy.type === 'frequency' || this.settings.sizeBy.type === 'frequency') {
        const fdg = this;

        container = this.controls.container
            .append('div')
            .classed('fdg-control fdg-control--event-list', true);
        inputs = container
            .selectAll('div')
            .data(this.metadata.event)
            .enter()
            .append('div')
            .attr(
                'class',
                (d) => `fdg-button ${this.settings.eventChangeCount.includes(d.key) ? 'current' : ''}`
            )
            .attr(
                'title',
                (d) =>
                    `${this.settings.eventChangeCount.includes(d.key) ? 'Remove' : 'Add'} ${
                        d.key
                    } ${
                        this.settings.eventChangeCount.includes(d.key) ? 'from' : 'to'
                    } the list of events that control bubble ${
                        this.settings.colorBy.type === 'frequency' &&
                        this.settings.sizeBy.type === 'frequency'
                            ? 'color and size'
                            : this.settings.colorBy.type === 'frequency'
                            ? 'color'
                            : this.settings.sizeBy.type === 'frequency'
                            ? 'size'
                            : "[ something isn't right here ]."
                    }.`
            )
            .text((d) => d.key);

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
            this.title = `${fdg.settings.eventChangeCount.includes(d.key) ? 'Remove' : 'Add'} ${
                d.key
            } ${
                fdg.settings.eventChangeCount.includes(d.key) ? 'from' : 'to'
            } the list of events that control bubble ${
                fdg.settings.colorBy.type === 'frequency' && fdg.settings.sizeBy.type === 'frequency'
                    ? 'color and size'
                    : fdg.settings.colorBy.type === 'frequency'
                    ? 'color'
                    : fdg.settings.sizeBy.type === 'frequency'
                    ? 'size'
                    : "[ something isn't right here ]."
            }.`;

            // Update color-size toggle.
            //fdg.controls.colorSizeToggle.inputs.attr(
            //    'title',
            //    (di) =>
            //        `Quantify the number of ${fdg.util.csv(fdg.settings.eventChangeCount)} events by ${
            //            di !== 'both' ? di : 'color and size'
            //        }.`
            //);

            // Update legend label.
            fdg.legends.container
                .classed('fdg-invisible', fdg.settings.eventChangeCount.length === 0)
                .selectAll('span.fdg-measure')
                .text(fdg.util.csv(fdg.settings.eventChangeCount));

            redraw.call(fdg, false);
        });
    }

    return {
        container,
        inputs,
    };
}
