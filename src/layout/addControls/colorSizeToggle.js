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
            (d) => `togglebutton ${d} ${d === this.settings.eventChangeCountAesthetic ? 'current' : ''}`
        )
        .attr('title', d => `Quantify the number of times ${'this.settings.eventsToCount'} have occured by ${d !== 'both' ? d : 'color and size'}`)
        .text((d) => d);
    inputs.on('click', function (d) {
        inputs.classed('current', (di) => di === d);
        fdg.settings.eventChangeCountAesthetic = d;
        fdg.legends.selectAll('.fdg-legend').classed('fdg-hidden', function () {
            return !Array.from(this.classList).some((value) => value.includes(d));
        });

        fdg.data.nested.forEach(d => {
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
                fdg.settings.eventChangeCountAesthetic !== 'size' ? fdg.settings.color(stateChanges) : '#aaa';
        });
    });

    return {
        container,
        inputs,
    };
}
