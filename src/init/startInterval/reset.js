import restartForceSimulation from './restartForceSimulation';
import resetCountdown from './reset/countdown';
import resetTimeout from './reset/timeout';

export default function reset(data) {
    this.interval.stop();

    // Reheat the animation one last time so marks reach to their final destination.
    restartForceSimulation.call(this);

    // Display a visual countdown to reset.
    const countdown = resetCountdown.call(this);

    // Set a timeout before resetting the animation.
    const timeout = resetTimeout.call(this, data, countdown);
}
