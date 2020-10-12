import update from './startInterval/update';
import reset from './startInterval/reset';
import restartForceSimulation from './startInterval/restartForceSimulation';

export const increment = function (arg) {
    // Increment the timepoint.
    this.settings.timepoint += !!arg;

    // Update animation if the current timepoint is less than duration of animation.
    if (this.settings.timepoint <= this.settings.duration) update.call(this);
    // Otherwise reset animation.
    else reset.call(this);

    // Resume the force simulation.
    restartForceSimulation.call(this);
};

// Default returns an interval that runs increment() every time unit.
export default function startInterval() {
    const interval = d3.interval(increment.bind(this), this.settings.speeds[this.settings.speed]);

    return interval;
}
