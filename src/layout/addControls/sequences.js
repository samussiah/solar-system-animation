import sequence from './sequences/sequence';
import fullAnimation from './sequences/fullAnimation';

export default function sequences() {
    if (!!this.settings.sequences) {
        const main = this;

        const container = this.util
            .addElement('sequences', this.containers.controls)
            .classed('fdg-control fdg-control--sequences', true);

        const inputs = container
            .selectAll('div')
            .data([this, ...this.settings.sequences])
            .join('div')
            .classed('fdg-button fdg-button--sequence', true)
            .attr('title', (d) => `View ${d !== this ? `sequence ${d.label}` : 'full animation'}.`)
            .text((d, i) =>
                d.label ? d.label : d === this ? 'Full Animation' : `Sequence ${i + 1}`
            );

        inputs.on('click', function (d) {
            // Toggle control.
            inputs.classed('fdg-button--current', false);
            this.classList.toggle('fdg-button--current');

            // Stop any running interval or timeout.
            if (main.interval) main.interval.stop();
            if (main.timeout) main.timeout.stop();

            // TODO: figure out if force simulation should be maintained or if it's sufficient to
            // maintain the position of nodes on the nexted data array.
            //if (main.forceSimulation) main.forceSimulation.stop();

            // Update sequence property.
            delete main.sequence;
            main.sequence = d !== main ? d : null;

            // Run sequence or...
            if (d !== main) sequence.call(main, d);
            // ...full animation.
            else fullAnimation.call(main, d);
        });

        return {
            container,
            inputs,
        };
    }
}
