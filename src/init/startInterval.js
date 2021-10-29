import timeoutBetweenStates from './startInterval/timeoutBetweenStates';
import update from './startInterval/update';
import reset from './startInterval/reset';
import runNextSequence from './startInterval/runNextSequence';
import restartForceSimulation from './startInterval/restartForceSimulation';

export const increment = function (data, increment) {
    // Increment timepoint.
    this.settings.timepoint += !!increment;

    // Update speed.
    if (
        Array.isArray(this.settings.speedChange) &&
        this.settings.speedChange.map((speed) => speed.timepoint).includes(this.settings.timepoint)
    ) {
        this.settings.speed = this.settings.speedChange.find(
            (speed) => speed.timepoint === this.settings.timepoint
        ).speed;
        if (!!this.interval) this.interval.stop();
        this.interval = startInterval.call(this, this.sequence ? this.sequence.data : this.data);
    }

    timeoutBetweenStates.call(this);

    // Update animation if current timepoint is less than full duration of animation.
    if (this.settings.timepoint <= this.settings.duration) update.call(this, data);
    // Otherwise if animation is sequenced, run next sequence.
    else if (this.sequence) runNextSequence.call(this);
    // Otherwise restart animation.
    else if (this.settings.loop === true) reset.call(this, data);

    // Reheat the force simulation.
    restartForceSimulation.call(this);
};

// Default returns an interval that runs increment() every time unit.
export default function startInterval(data) {
    const interval = d3.interval(
        increment.bind(this, data),
        this.settings.speeds[this.settings.speed]
    );

    return interval;
}
