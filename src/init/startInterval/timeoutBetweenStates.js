import updateText from './timeoutBetweenStates/updateText';
import startInterval from '../startInterval';

export default function timeoutBetweenStates() {
    if (this.settings.stateChange === 'ordered') {
        this.prevEvent = this.currEvent;
        this.currEvent = this.metadata.event.find(
            (event) =>
                event.start_timepoint <= this.settings.timepoint &&
                this.settings.timepoint <= event.end_timepoint
        );

        if (this.settings.timepoint === this.currEvent?.start_timepoint) {
            this.interval.stop();

            updateText.call(this);

            // Skip timeout before first state.
            if (this.prevEvent !== undefined)
                this.timeout = d3.timeout(() => {
                    this.interval = startInterval.call(this, this.data);
                }, this.settings.modalSpeed);
            else this.interval = startInterval.call(this, this.data);
        }
    }
}
