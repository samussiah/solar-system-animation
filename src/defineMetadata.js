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
    this.settings.minRadius = this.settings.minRadius || 3000 / metadata.id.filter(d => !(this.settings.drawStaticSeparately && d.static)).length;
    this.settings.staticRadius = this.settings.staticRadius || 3000 / metadata.id.length;
    this.settings.maxRadius =
        this.settings.maxRadius || this.settings.minRadius + this.settings.colors().length;
    this.settings.chargeStrength = - ( 2000 / metadata.id.filter(d => !(this.settings.drawStaticSeparately && d.static)).length );
    this.settings.staticChargeStrength = - ( 2000 / metadata.id.length );
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
    this.settings.R = this.settings.width / metadata.event.length / 2;

    // Define orbits.
    metadata.orbit = orbit.call(this, metadata.event);

    // Determine the dimensions of the canvas, the position of the foci, and the size of the orbits.
    coordinates.call(this, metadata);

    // Define color scale.
    const colors = this.settings.colors();
    if (this.settings.colorBy.type === 'frequency') {
        this.colorScale = d3
            .scaleLinear()
            .domain(d3.range(colors.length))
            .range(colors)
            .clamp(true);
    } else if (this.settings.colorBy.type === 'continuous') {
        this.colorScale = d3
            .scaleSequential(d3.interpolateRdYlGn)
            .domain(d3.extent(this.data, (d) => d[this.settings.colorBy.variable]));
        const interpolator = this.colorScale.interpolator(); // read the color scale's interpolator
        const mirror = (t) => interpolator(1 - t); // returns the mirror image of the interpolator
        if (this.settings.colorBy.mirror) this.colorScale.interpolator(mirror); // updates the scale's interpolator
    } else if (this.settings.colorBy.type === 'categorical') {
        this.colorScale = d3
            .scaleOrdinal()
            .domain([...new Set(this.data.map((d) => d[this.settings.colorBy.variable])).values()])
            .range(d3.schemeTableau10);
    }

    return metadata;
}
