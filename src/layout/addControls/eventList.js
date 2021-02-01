import { increment as redraw } from '../../init/startInterval';

export default function eventList() {
    let container, inputs;

    if (this.settings.colorBy.type === 'frequency' || this.settings.sizeBy.type === 'frequency') {
        const main = this;

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
                (d) =>
                    `fdg-button ${this.settings.eventChangeCount.includes(d.key) ? 'fdg-button--current' : ''}`
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
            this.classList.toggle('fdg-button--current');

            // Update event array.
            if (main.settings.eventChangeCount.includes(this.textContent))
                main.settings.eventChangeCount.splice(
                    main.settings.eventChangeCount.findIndex((event) => event === this.textContent),
                    1
                );
            else main.settings.eventChangeCount.push(this.textContent);

            // Update tooltip.
            this.title = `${main.settings.eventChangeCount.includes(d.key) ? 'Remove' : 'Add'} ${
                d.key
            } ${
                main.settings.eventChangeCount.includes(d.key) ? 'from' : 'to'
            } the list of events that control bubble ${
                main.settings.colorBy.type === 'frequency' &&
                main.settings.sizeBy.type === 'frequency'
                    ? 'color and size'
                    : main.settings.colorBy.type === 'frequency'
                    ? 'color'
                    : main.settings.sizeBy.type === 'frequency'
                    ? 'size'
                    : "[ something isn't right here ]."
            }.`;

            // Update color-size toggle.
            //main.controls.colorSizeToggle.inputs.attr(
            //    'title',
            //    (di) =>
            //        `Quantify the number of ${main.util.csv(main.settings.eventChangeCount)} events by ${
            //            di !== 'both' ? di : 'color and size'
            //        }.`
            //);

            // Update legend label.
            main.legends.container
                .classed('fdg-invisible', main.settings.eventChangeCount.length === 0)
                .selectAll('span.fdg-measure')
                .text(main.util.csv(main.settings.eventChangeCount));

            redraw.call(main, main.data, false);
        });
    }

    return {
        container,
        inputs,
    };
}
