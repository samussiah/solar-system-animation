export default function getCoordinates(state, colorValue) {
    const destination =
        this.settings.stratify && this.settings.colorBy.stratify
            ? this.metadata.event
                  .find((event) => event.key === state.event)
                  .foci.find((focus) => focus.key === colorValue)
            : this.metadata.event.find((event) => event.key === state.event);
    const coordinates = { x: destination.x, y: destination.y };

    return coordinates;
}
