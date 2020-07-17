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
            (d) =>
                `togglebutton ${this.settings.eventChangeCount.includes(d.value) ? 'current' : ''}`
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

        // Update legend label.
        fdg.legends
            .classed('fdg-hidden', fdg.settings.eventChangeCount.length === 0)
            .selectAll('span.fdg-measure')
            .text(fdg.settings.eventChangeCount.join(', '));

        // Recalculate radius and fill/stroke of points.
        fdg.data.nested.forEach((d) => {
            // Add to new activity count
            const stateChanges = d3.sum(
                d.events.filter((event) => fdg.settings.eventChangeCount.includes(event.value)),
                (event) => event.count
            );
            d.r =
                fdg.settings.eventChangeCountAesthetic !== 'color'
                    ? Math.min(fdg.settings.minRadius + stateChanges, fdg.settings.maxRadius)
                    : fdg.settings.minRadius;
            d.color =
                fdg.settings.eventChangeCountAesthetic !== 'size'
                    ? fdg.settings.color(stateChanges)
                    : '#aaa';
        });
    });

    return {
        container,
        inputs,
    };
}
