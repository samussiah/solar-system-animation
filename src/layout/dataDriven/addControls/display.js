export default function display() {
    const main = this;

    const container = this.controls.container.append('div').classed('fdg-control--display', true);

    const inputs = container
        .append('div')
        .classed('fdg-display-controls', true)
        .datum({
            state: true,
            symbol: '-',
        })
        .html((d) => `Controls <span class = 'fdg-expand'>${d.symbol}</span>`)
        .attr('title', (d) => (d.state ? 'Hide controls.' : 'Display controls.'));

    inputs.on('click', function (d) {
        d.state = !d.state;
        d.symbol = d.state ? '-' : '+';
        main.controls.display.inputs
            .html(`Controls <span class = 'fdg-expand'>${d.symbol}</span>`)
            .attr('title', (d) => (d.state ? 'Hide controls.' : 'Display controls.'));
        main.controls.containers.each(function () {
            this.classList.toggle('fdg-control--collapsed');
        });
    });

    return {
        container,
        inputs,
    };
}
