import getNextSequence from '../../init/startInterval/runNextSequence/getNextSequence';
import runSequence from '../../init/startInterval/runNextSequence/runSequence';
import addForceSimulation from '../../init/addForceSimulation';
import startInterval from '../../init/startInterval';
import resetAnimation from '../../init/startInterval/reset/animation';
import toggle from '../addControls/playPause/toggle';

export default function sequences(controls) {
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
            inputs.classed('current', false);
            this.classList.toggle('current');
            if (main.interval) main.interval.stop();
            if (main.timeout) main.timeout.stop();
            //if (main.forceSimulation) main.forceSimulation.stop();
            delete main.sequence;
            main.sequence = d !== main
                ? d
                : null;

            if (d !== main) {
                main.settings.animationTrack = 'sequence';
                main.containers.sequenceOverlay.classed('fdg-hidden', false);
                main.settings.sequenceIndex = main.settings.sequences
                    .findIndex(sequence => sequence === d);
                main.sequence = getNextSequence.call(main, false);
                main.sequence.eventIndex = 0;
                main.timeout = d3.timeout(() => {
                    runSequence.call(main);
                }, 1000);
            } else {
                main.settings.animationTrack = 'full';
                // Update settings.
                main.settings.duration = main.settings_initial.duration;
                main.settings.loop = main.settings_initial.loop;

                // Update text.
                main.containers.sequenceOverlay.classed('fdg-hidden', true);
                main.containers.timeRelative.html(main.settings_initial.timeRelative);

                // Stop current interval and force simulation.
                if (main.interval) main.interval.stop();
                if (main.forceSimulation) main.forceSimulation.stop();

                // Restart force simulation.
                main.forceSimulation = addForceSimulation.call(main, main.data);

                // Reset animation.
                resetAnimation.call(main, main.data);

                // Restart interval.
                main.timeout = d3.timeout(() => {
                    main.interval = startInterval.call(main, main.data);
                }, 1000);

                // Play animation.
                if (main.settings.playPause !== 'play') toggle.call(main);
            }
        });

        return {
            container,
            inputs,
        };
    }
}
