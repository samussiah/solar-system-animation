import colors from './settings/colors';
import colorScale from './settings/colorScale';
import color from './settings/color';

const settings = {
    // data mappings
    id_var: 'id',
    event_var: 'event',
    event_order_var: 'event_order',
    start_timepoint_var: 'stdy',
    end_timepoint_var: 'endy',
    duration_var: 'duration',
    sequence_var: 'seq',

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
    colorBy: {
        type: 'frequency', // ['frequency', 'continuous', 'categorical']
        variable: null,
        label: null,
    },
    colors,
    colorScale,
    color,
    fill: null, // defined in ./defineMetadata/dataDrivenSettings
    minRadius: null, // defined in ./defineMetadata/dataDrivenSettings
    maxRadius: null, // defined in ./defineMetadata/dataDrivenSettings
    shape: 'circle',

    // modals
    modal: true, // display modals?
    modalSpeed: 15000, // amount of time for which each modal appears
    explanation: [
        'Each bubble in this animation represents an individual.',
        'As individuals experience events and change states, their bubble gravitates toward the focus representing that event.',
        'The number of state changes dictates the color and/or size of the bubbles.',
        'Use the controls above to interact with and alter the animation.',
    ], // array of strings
    information: null, // array of strings
};

export default settings;
