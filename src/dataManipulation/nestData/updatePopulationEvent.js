export default function updatePopulationEvent(state) {
    const event = this.metadata.event.find((event) => event.value === state.event);
    event.count += 1;

    return event;
}
