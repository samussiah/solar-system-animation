// TODO: Pass the previous event to the function to add a condition to determine when to increment or not.
//
// The focus count should always update but the individual state changes and the cumulative event
// count should only increase if previous event is not the central event, don't increment the
// individual.
export default function updateEventCount(events, state, increment = true) {
    const event = events.find((event) => event.value === state);
    event.count = increment ? event.count + 1 : event.count - 1;
    if (increment)
        event.cumulative++;

    return event;
}
