import fadeIn from './runSequence/fadeIn';
import nestData from '../../../dataManipulation/nestData';
import addForceSimulation from '../../addForceSimulation';
import startInterval from '../../startInterval';

// TODO: figure out whether a timeout wrapper is needed around this function call
// TODO: figure out how to make this function work from the UI as well as automatically with the flow of the animation
// TODO: modularize this function with declaritive subfunctions
// TODO: separate mid-sequence updates from new sequence updates
export default function runSequence() {
    // Update the sequence button corresponding to the current sequence.
    this.controls.sequences.inputs.classed(
        'fdg-button--current',
        (d) => d.label === this.sequence.label
    );

    //const start_orbit = this.metadata.orbit
    //    .find((orbit) => +orbit.key === this.sequence.start_order);
    //this.sequence.events = start_orbit.values;
    this.sequence.event = this.sequence.events
        .find((event, i) => i === this.sequence.eventIndex);

    // Update progress text.
    this.settings.timepoint = 0;
    this.containers.timepoint.html('0 days');
    this.containers.timer.percentComplete.html('0%');

    // TODO: transition text in and out
    if (this.sequence.eventIndex === 0) {
        this.containers.timeRelative.html(this.sequence.timeRelative || this.settings.timeRelative);

        // fade in
        this.sequence.backgroundSequence = fadeIn
            .call(this, this.containers.sequenceOverlay.background.sequence, this.sequence.label);
        this.sequence.foregroundSequence = fadeIn
            .call(this, this.containers.sequenceOverlay.foreground.sequence, this.sequence.label);
    }

    // fade in
    this.sequence.backgroundEvent = fadeIn
        .call(this, this.containers.sequenceOverlay.background.event, `${this.settings.individualUnit.replace(/^(.)/, char => char.toUpperCase())}s: ${this.sequence.event.key}`);
    this.sequence.foregroundEvent = fadeIn
        .call(this, this.containers.sequenceOverlay.foreground.event, `${this.settings.individualUnit.replace(/^(.)/, char => char.toUpperCase())}s: ${this.sequence.event.key}`);

    // Subset data to the specified set of states.
    if (this.sequence.eventIndex === 0)
        this.sequence.data = this.data
            .filter(
                (d) => this.sequence.start_order <= d.event_order && d.event_order <= this.sequence.end_order
            )
            .map((d) => ({ ...d }));

    if (this.sequence.eventIndex === 0) {
        // Re-calculate start and end timepoints from first state in sequence.
        d3.nest()
            .key((d) => d.id)
            .rollup((group) => {
                const baseline = group[0]; // first state in sequence
                const timeShift = baseline.start_timepoint;

                // Track cumulative duration to send individuals to the final state in the sequence prematurely.
                let duration_cumulative = 0;

                group.forEach((d, i) => {
                    duration_cumulative += d.duration;
                    d.duration_cumulative = duration_cumulative;

                    // Adjust start and end timepoint.
                    d.start_timepoint = d === baseline
                        ? 1
                        : d.start_timepoint - timeShift + 1;
                    d.end_timepoint = d.start_timepoint + d.duration - 1;

                    // Set start timepoint to sequence duration if start timepoint is greater than sequence duration.
                    if (!!this.sequence.duration && d.start_timepoint > this.sequence.duration)
                        d.start_timepoint = this.sequence.duration;

                    // Set end timepoint to sequence duration if end timepoint is greater than sequence duration.
                    if (!!this.sequence.duration && d.end_timepoint > this.sequence.duration)
                        d.end_timepoint = this.sequence.duration;
                });

                return group;
            })
            .entries(this.sequence.data);
    }

    // Re-define nested data with sequence subset.
    // TODO: define a function to maintain state of nodes through animation, e.g. when changing
    // animation track between full animation and sequences or resetting the animation
    if (this.sequence.eventIndex === 0) {
        this.sequence.data.nested = nestData.call(this, this.sequence.data);
        this.sequence.data.nested.forEach((d) => {
            const node = this.nodes.find((node) => node.key === d.key);
            for (const prop in node)
                if (['key', 'value'].includes(prop) === false) d[prop] = node[prop];
        });
    }

    // Lock nodes in place while another event sequence runs.
    this.sequence.data.nested.forEach((d) => {
        d.value.locked = d.value.state.event !== this.sequence.event.key;
    });

    const duration =
        d3.max(
            this.sequence.data.nested.filter((d) => d.value.locked === false),
            (d) => d.value.state.duration
        ) + 1;
    this.settings.duration = this.sequence.duration ? Math.min(this.sequence.duration, duration) : duration;

    // Re-define force simulation.
    if (this.forceSimulation) this.forceSimulation.stop();
    this.forceSimulation = addForceSimulation.call(this, this.sequence.data);
    this.nodes = this.forceSimulation.nodes();
    this.forceSimulation.force('center', null);

    // Stop the current animation
    if (this.interval) this.interval.stop();

    // Start the sequence animation.
    const timeout = d3.timeout(() => {
        this.interval = startInterval.call(this, this.sequence.data);
    }, this.settings.modalSpeed);

    return timeout;
}
