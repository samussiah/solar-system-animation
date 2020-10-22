import update from './settings/update';
import colors from './settings/colors';
import colorScale from './settings/colorScale';
import color from './settings/color';

const settings = {
    update,

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
    drawStaticSeparately: true, // draw static bubbles in a static force simulation to improve performance

    // animation settings
    speed: 'medium',
    speeds: {
        slow: 1000,
        medium: 500,
        fast: 100,
    },
    playPause: 'play',
    pulseOrbits: false,

    // dimensions
    width: null, // defined in ./defineMetadata/coordinates
    height: null, // defined in ./defineMetadata/coordinates
    padding: 1,
    nOrbits: null, // defined in ./defineMetadata/dataDrivenSettings/orbits
    orbitRadius: 150,
    nFoci: null, // defined in ./defineMetadata/dataDrivenSettings/event
    translate: false,
    hideControls: false,

    // force simulation settings
    chargeStrength: null, // defined in ./defineMetadata
    staticLayout: 'circular',
    manyBody: 'forceManyBodyReuse', // ['forceManyBody', 'forceManyBodyReuse', 'forceManyBodySampled']

    // bubble color settings
    colorBy: {
        type: 'frequency', // ['frequency', 'continuous', 'categorical']
        variable: null,
        label: null,
    },
    colors,
    colorScale,
    color,
    fill: null, // defined in ./defineMetadata/dataDrivenSettings

    // bubble size settings
    sizeBy: {
        type: 'frequency', // ['frequency', 'continuous']
        variable: null,
        label: null,
    },
    minRadius: null, // defined in ./defineMetadata/dataDrivenSettings
    maxRadius: null, // defined in ./defineMetadata/dataDrivenSettings
    shape: 'circle',

    // modals
    modal: true, // display modals?
    modalSpeed: 15000, // amount of time for which each modal appears
    modalIndex: 0,
    explanation: [
        'Each bubble in this animation represents an individual.',
        'As <span class = "fdg-emphasized">time progresses</span> and individuals experience events, their bubble gravitates toward the focus or "planet" representing that event.',
        'The <span class = "fdg-emphasized">number of events</span> an individual has experienced determines the color and/or size of their bubble.',
        '<span class = "fdg-emphasized">Static bubbles</span> represent individuals who never experience an event.',
        'Use the <span class = "fdg-emphasized">controls</span> on the right to interact with and alter the animation.',
        'Continue watching to learn how these individuals progress over the course of [duration] days.',
    ], // array of strings
    information: null, // array of strings
};

export default settings;
