export default function updateCumulative(events, state, previousState) {
    const event = events.find((event) => event.value === state);

    event.cumulative++;
    //event.cumulative +=
    //    this.settings.eventFinal.includes(state) || previousState === this.settings.eventCentral;

    return event;
}
