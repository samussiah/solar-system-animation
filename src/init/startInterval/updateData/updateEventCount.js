// TODO: Pass the previous event to the function to add a condition to determine when to increment or not.
//
// The focus count should always update but the individual state changes and the cumulative event
// count should only increase if previous event is not the central event, don't increment the
// individual.
export default function updateEventCount(events, state, previousState = null, increment = true) {
    const event = events.find((event) => event.value === state);

    // Increment only if previous state is the central event or if the current state is the final state.
    // Decrement regardless, when an individual leaves a focus.
    event.count = increment
        ? event.count +
          (previousState === null ||
              state === this.settings.eventFinal ||
              previousState === this.settings.eventCentral)
        : event.count - 1;

    // Increment cumulative only if previous state is the central event or if the current state is the final state.
    if (increment) {
        event.cumulative += this.settings.eventSequence.includes(previousState) === false;
    }

    return event;
}
