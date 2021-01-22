import fadeIn from './runSequence/fadeIn';
import nestData from '../dataManipulation/nestData';
import addForceSimulation from './addForceSimulation';
import startInterval from './startInterval';

// TODO: modularize this function with declaritive subfunctions
// TODO: separate mid-sequence updates from new sequence updates
export default function runSequence(sequence, event) {
    const start_orbit = this.metadata.orbit.find((orbit) => +orbit.key === sequence.start_order);
    sequence.events = start_orbit.values;
    sequence.event = sequence.events.find((event, i) => i === sequence.event_index);

    // Update progress text.
    this.settings.timepoint = 0;
    this.containers.timepoint.html('0 days');
    this.containers.timer.percentComplete.html('0%');

    // TODO: transition text in and out
    if (this.sequence.event_index === 0) {
        this.containers.timeRelative.html(sequence.timeRelative || this.settings.timeRelative);

        // fade in
        sequence.backgroundSequence = fadeIn
            .call(this, this.containers.sequenceOverlay.background.sequence, this.sequence.label);
        sequence.foregroundSequence = fadeIn
            .call(this, this.containers.sequenceOverlay.foreground.sequence, this.sequence.label);
    }

    // fade in
    sequence.backgroundEvent = fadeIn
        .call(this, this.containers.sequenceOverlay.background.event, `${this.settings.individualUnit.replace(/^(.)/, char => char.toUpperCase())}s: ${this.sequence.event.key}`);
    sequence.foregroundEvent = fadeIn
        .call(this, this.containers.sequenceOverlay.foreground.event, `${this.settings.individualUnit.replace(/^(.)/, char => char.toUpperCase())}s: ${this.sequence.event.key}`);

    // Subset data to the specified set of states.
    if (this.sequence.event_index === 0)
        sequence.data = this.data
            .filter(
                (d) => sequence.start_order <= d.event_order && d.event_order <= sequence.end_order
            )
            .map((d) => ({ ...d }));

    if (this.sequence.event_index === 0) {
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
                    if (!!sequence.duration && d.start_timepoint > sequence.duration)
                        d.start_timepoint = sequence.duration;

                    // Set end timepoint to sequence duration if end timepoint is greater than sequence duration.
                    if (!!sequence.duration && d.end_timepoint > sequence.duration)
                        d.end_timepoint = sequence.duration;
                });

                return group;
            })
            .entries(sequence.data);
    }

    // Re-define nested data with sequence subset.
    if (this.sequence.event_index === 0) {
        sequence.data.nested = nestData.call(this, sequence.data);
        sequence.data.nested.forEach((d) => {
            const node = this.nodes.find((node) => node.key === d.key);
            for (const prop in node)
                if (['key', 'value'].includes(prop) === false) d[prop] = node[prop];
        });
    }

    // Lock nodes in place while another event sequence runs.
    sequence.data.nested.forEach((d) => {
        d.value.locked = d.value.state.event !== sequence.event.key;
    });

    const duration =
        d3.max(
            sequence.data.nested.filter((d) => d.value.locked === false),
            (d) => d.value.state.duration
        ) + 1;
    this.settings.duration = sequence.duration ? Math.min(sequence.duration, duration) : duration;

    // Re-define force simulation.
    if (this.forceSimulation) this.forceSimulation.stop();
    this.forceSimulation = addForceSimulation.call(this, sequence.data);
    this.nodes = this.forceSimulation.nodes();
    this.forceSimulation.force('center', null);

    // Stop the current animation
    if (this.interval) this.interval.stop();

    // Start the sequence animation.
    setTimeout(() => {
        this.interval = startInterval.call(this, sequence.data);
    }, this.settings.modalSpeed);
}
