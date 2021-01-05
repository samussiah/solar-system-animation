export default function updateEventDependentSettings(metadata) {
    this.settings.eventCentral = this.settings.eventCentral || metadata.event[0].value;
    this.settings.eventChangeCount =
        this.settings.eventChangeCount || metadata.event.slice(1).map((event) => event.value);
}
