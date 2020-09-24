import resetCountdown from './reset/countdown';
import resetTimeout from './reset/timeout';

export default function reset() {
    this.interval.stop();

    // Display a visual countdown to reset.
    const countdown = resetCountdown.call(this);

    // Set a timeout before resetting the animation.
    const timeout = resetTimeout.call(this, countdown);
}
