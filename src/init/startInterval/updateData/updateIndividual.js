export default function updateIndividual(events, state, previousState) {
    const event = events.find((event) => event.value === state);

    event.count +=
        state === this.settings.eventFinal || previousState === this.settings.eventCentral;

    return event;
}
