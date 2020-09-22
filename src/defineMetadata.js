import id from './defineMetadata/id';
import event from './defineMetadata/event';
import orbit from './defineMetadata/orbit';
import coordinates from './defineMetadata/coordinates';

export default function defineMetadata() {
    // Define sets.
    const metadata = {};

    // Add additional metadata to ID set.
    metadata.id = id.call(this);

    // Settings dependent on the ID set.
    this.settings.duration = this.settings.duration || d3.max(metadata.id, (id) => id.duration);
    this.settings.minRadius = this.settings.minRadius || 3000 / metadata.id.length;
    this.settings.maxRadius =
        this.settings.maxRadius || this.settings.minRadius + this.settings.colors().length;
    this.settings.fill = this.settings.fill || metadata.id.length <= 2500;

    // Add additional metadata to event set.
    metadata.event = event.call(this);

    // Update settings that depend on event set.
    this.settings.width = this.settings.width || metadata.event.length;
    this.settings.eventCentral = this.settings.eventCentral || metadata.event[0].value;
    this.settings.eventFinal =
        Array.isArray(this.settings.eventFinal) && this.settings.eventFinal.length
            ? this.settings.eventFinal
            : [this.settings.eventFinal || metadata.event[metadata.event.length - 1].value];
    this.settings.nFoci =
        this.settings.nFoci || metadata.event.length - !!this.settings.eventCentral; // number of event types minus one
    this.settings.eventChangeCount =
        this.settings.eventChangeCount || metadata.event.slice(1).map((event) => event.value);
    this.settings.eventSequence = metadata.event
        .filter((event, i) => (this.settings.excludeLast ? i !== metadata.event.length - 1 : false))
        .filter((event, i) => (this.settings.excludeFirst ? i !== 0 : false))
        .map((event) => event.value);
    this.settings.R = this.settings.width / metadata.event.length / 2;

    // Define orbits.
    metadata.orbit = orbit.call(this, metadata.event);

    // Determine the dimensions of the canvas, the position of the foci, and the size of the orbits.
    coordinates.call(this, metadata);

    // Define color scale.
    const colors = this.settings.colors();
    if (this.settings.colorBy.type === 'frequency') {
        this.colorScale = d3.scaleLinear()
            .domain(d3.range(colors.length))
            .range(colors)
            .clamp(true);
    } else if (this.settings.colorBy.type === 'continuous') {
        this.colorScale = d3.scaleSequential()
            .domain(d3.extent(this.data, d => d[this.settings.colorBy.variable]).reverse())
            .interpolator(d3.interpolateRdYlGn)
            .clamp(true);
    } else if (this.settings.colorBy.type === 'categorical') {
        console.log('here');
        this.colorScale = d3.scaleOrdinal()
            .domain([...new Set(this.data.map(d => d[this.settings.colorBy.variable])).values()])
            .range(d3.schemeTableau10);
    }
    //console.log(this.data);
    //console.log(this.colorScale.domain());
    //console.log(this.colorScale.range());
    //console.log(
    //    JSON.stringify(
    //        d3.range(3).map(d => d3.color(this.colorScale(d/100)).formatHex()),
    //        null,
    //        4
    //    )
    //);

    return metadata;
}
