import colors from './settings/colors';
import colorScale from './settings/colorScale';
import color from './settings/color';

const settings = {
    // time settings
    timepoint: 0,
    timeUnit: 'days since randomization',
    duration: null, // defined in ./defineMetadata/dataDrivenSettings
    resetDelay: 15000,

    // event settings
    events: null, // defined in ./defineMetadata
    eventCentral: null, // defined in ./defineMetadata/dataDrivenSettings
    eventCount: true, // display count (percentage) beneath focus labels?
    eventChangeCount: null, // defined in ./defineMetadata/dataDrivenSettings
    eventChangeCountAesthetic: 'color',
    individualCounts: null,
    individualCountEvents: null,
    excludeFirst: true,
    excludeLast: true,

    // animation settings
    speed: 'slow',
    speeds: {
        slow: 1000,
        medium: 200,
        fast: 50,
    },
    playPause: 'play',

    // dimensions
    width: null, // defined in ./defineMetadata/coordinates
    height: null, // defined in ./defineMetadata/coordinates
    padding: 1,
    nOrbits: null, // defined in ./defineMetadata/dataDrivenSettings/orbits
    orbitRadius: 150,
    nFoci: null, // defined in ./defineMetadata/dataDrivenSettings/event
    translate: false,
    hideControls: false,

    // color and size settings
    colors,
    colorScale,
    color,
    fill: null, // defined in ./defineMetadata/dataDrivenSettings
    minRadius: null, // defined in ./defineMetadata/dataDrivenSettings
    maxRadius: null, // defined in ./defineMetadata/dataDrivenSettings

    // miscellaneous
    notes: null, // array of objects with startTimepoint, stopTimepoint, and text properties
};

export default settings;
