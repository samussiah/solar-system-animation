export default function updateCumulative(events, state, previousState) {
    const event = events.find((event) => event.value === state);

    event.cumulative +=
        state === this.settings.eventFinal || previousState === this.settings.eventCentral;

    return event;
}
