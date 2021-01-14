import nestData from '../dataManipulation/nestData';
import addForceSimulation from './addForceSimulation';
import tick from './addForceSimulation/tick';
import { increment } from './startInterval';
import startInterval from './startInterval';

// TODO: separate mid-sequence updates from new sequence updates
export default function runSequence(sequence, event) {
    console.log(sequence.label);
    console.log(sequence.event_index);
    const start_orbit = this.metadata.orbit
        .find(orbit => +orbit.key === sequence.start_order);
    sequence.events = start_orbit.values;
    sequence.event = sequence.events.find((event,i) => i === sequence.event_index);

    // Update progress text.
    this.settings.timepoint = 0;
    if (this.sequence.event_index === 0)
        this.containers.sequence.classed('fdg-hidden', false);
    this.containers.sequence
        .html(`${sequence.label}<br><small>${start_orbit.label}: ${sequence.event.key}</small>`);
    this.containers.timepoint.html('0 days');
    if (this.sequence.event_index === 0)
        this.containers.timeRelative.html(sequence.timeRelative || this.settings.timeRelative);
    this.containers.timer.percentComplete.html('0%');

    // Subset data to the specified set of states.
    if (this.sequence.event_index === 0)
        sequence.data = this.data
            .filter(d => (
                sequence.start_order <= d.event_order &&
                d.event_order <= sequence.end_order
            ))
            .map(d => ({...d}));

    if (this.sequence.event_index === 0) {
        // Track maximum duration of states prior to the final state in the sequence.
        let maxDuration = 0;

        // Re-calculate start and end timepoints from first state in sequence.
        d3.nest()
            .key(d => d.id)
            .rollup(group => {
                const baseline = group[0]; // first state in sequence

                // Track cumulative duration to send individuals to the final state in the sequence prematurely.
                let duration_cumulative = 0;

                group.forEach((d,i) => {
                    duration_cumulative += d.duration;
                    d.duration_cumulative = duration_cumulative;

                    // Adjust start timepoint.
                    if (d === baseline)
                        d.start_timepoint = 1;
                    else
                        d.start_timepoint = d.duration_cumulative < sequence.duration || !sequence.duration
                            ? d.start_timepoint - baseline.start_timepoint + 1
                            : sequence.duration;

                    // Adjust end timepoint.
                    d.end_timepoint = d.duration_cumulative < sequence.duration || !sequence.duration
                        ? d.start_timepoint + d.duration - 1
                        : d.start_timepoint;
                }); 

                // Track maximum duration of states prior to the final state in the sequence.
                maxDuration = Math.max(maxDuration, d3.sum(group.slice(0, group.length - 1), d => d.duration));

                return group;
            })
            .entries(sequence.data);

        // Update settings.
        this.settings.duration = sequence.duration || maxDuration + 1;
    }

    // Re-define nested data with sequence subset.
    if (this.sequence.event_index === 0) {
        sequence.data.nested = nestData.call(this, sequence.data)
        sequence.data.nested.forEach(d => {
            const node = this.nodes.find(node => node.key === d.key);
            for (const prop in node)
                if (['key', 'value'].includes(prop) === false)
                    d[prop] = node[prop];
        });
    }

    sequence.data.nested.forEach(d => {
        d.value.locked = d.value.state.event !== sequence.event.key;
    });

    // Re-define force simulation.
    if (this.forceSimulation)
        this.forceSimulation.stop();
    this.forceSimulation = addForceSimulation.call(this, sequence.data);
    this.nodes = this.forceSimulation.nodes();
    this.forceSimulation.force('center', null);
    //this.forceSimulation
    //    .nodes(sequence.data.nested)
    //    .on('tick', tick.bind(this, sequence.data));

    // Stop the current animation
    if (this.interval)
        this.interval.stop();

    //increment.call(this, sequence.data, false);

    // Start the sequence animation.
    setTimeout(
        () => {
            this.interval = startInterval.call(this, sequence.data);
        },
        this.settings.modalSpeed
    );
}
