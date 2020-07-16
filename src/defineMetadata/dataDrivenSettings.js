export default function dataDrivenSettings() {
    this.settings.minRadius = this.settings.minRadius || 3000/this.metadata.id.length;
    this.settings.maxRadius = this.settings.maxRadius || this.settings.minRadius + this.settings.colors().length;
    this.settings.reset = this.settings.reset || d3.max(this.metadata.id, id => id.duration);
    this.settings.eventCentral = this.settings.eventCentral || this.metadata.event[0].value;
    this.settings.eventChangeCount = this.settings.eventChangeCount || this.metadata.event.slice(1).map(event => event.value);
}
