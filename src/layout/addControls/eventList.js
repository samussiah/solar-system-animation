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
            (d) => `togglebutton ${this.settings.eventChangeCount.includes(d.value) ? 'current' : ''}`
        )
        .text((d) => d.value);

    inputs.on('click', function (d) {
        this.classList.toggle('current');
        if (fdg.settings.eventChangeCount.includes(this.textContent))
            fdg.settings.eventChangeCount.splice(fdg.settings.eventChangeCount.findIndex(event => event === this.textContent), 1);
        else
            fdg.settings.eventChangeCount.push(this.textContent);
    });

    return {
        container,
        inputs,
    };
}
