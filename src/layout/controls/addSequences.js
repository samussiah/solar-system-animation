import runSequence from '../../init/runSequence';
import addForceSimulation from '../../init/addForceSimulation';
import startInterval from '../../init/startInterval';
import resetAnimation from '../../init/startInterval/reset/animation';
import toggle from '../addControls/playPause/toggle';

export default function addSequences(controls) {
    if (!!this.settings.sequences) {
        const main = this;
        const container = this.util.addElement('sequences', controls)
            .classed('fdg-control fdg-control--sequences', true);

        const inputs = container
            .selectAll('div')
            .data([
                this,
                ...this.settings.sequences
            ])
            .join('div')
            .classed('fdg-button fdg-button--sequence', true)
            .attr(
                'title',
                (d) => `View the sequence from ${d.start_state} to ${d.end_state}.`
            )
            .text((d,i) => d.label ? d.label : d === this ? 'Full Animation' : `Sequence ${i + 1}`);

        inputs.on('click', function (d) {
            main.sequence = d;
            inputs.classed('current', (di) => di.label === d.label);
            if (d !== main) {
                runSequence.call(main, d);
            } else {
                delete main.sequence;
                // Update settings.
                main.settings.duration = main.settings_initial.duration;
                main.settings.loop = main.settings_initial.loop;
                main.containers.sequence.classed('fdg-hidden', true).html(null);
                main.containers.timeRelative.html(main.settings_initial.timeRelative);
                if (main.interval)
                    main.interval.stop();
                if (main.forceSimulation)
                    main.forceSimulation.stop();
                main.forceSimulation = addForceSimulation.call(main, main.data);
                resetAnimation.call(main, main.data);
                main.interval = startInterval.call(main, main.data);
                if (main.settings.playPause !== 'play') toggle.call(main);
            }
        });

        return {
            container,
            inputs,
        };
    }
}
