export default function updateEventCount(events, state, increment = true) {
    const event = events.find((event) => event.value === state);
    event.count = increment ? event.count + 1 : event.count - 1;

    return event;
}
