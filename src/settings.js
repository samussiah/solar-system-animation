import update from './settings/update';

const settings = {
    update,

    /**-------------------------------------------------------------------------------------------\
      data mapping
    \-------------------------------------------------------------------------------------------**/

    id_var: 'id',
    event_var: 'event',
    event_order_var: 'event_order',
    start_timepoint_var: 'stdy',
    end_timepoint_var: 'endy',
    duration_var: 'duration',
    sequence_var: 'seq',

    /**-------------------------------------------------------------------------------------------\
      aesthetics
    \-------------------------------------------------------------------------------------------**/

    // color
    colorBy: {
        type: 'frequency', // ['frequency', 'continuous', 'categorical']
        variable: null,
        label: null,
        mirror: true, // reverse color scheme?
        stratify: true, // present categories separately at each focus?
        colorScheme: 'RdYlGn',
        colorSchemes: ['blue', 'orange', 'red', 'purple', 'green', 'grey'], // must be one of D3's sequential, single-hue color schemes: https://github.com/d3/d3-scale-chromatic#sequential-single-hue
        nColors: 6, // min: 3, max: 9
    },
    color: 'rgb(170,170,170)',
    fill: null, // defined in ./defineMetadata/defineIdDependentSettings

    // size
    sizeBy: {
        type: 'frequency', // ['frequency', 'continuous']
        variable: null,
        label: null,
    },
    minRadius: null, // defined in ./defineMetadata/updateIdDependentSettings
    maxRadius: 10, // defined in ./defineMetadata/updateIdDependentSettings
    staticRadius: null, // defined in ./defineMetadata/updateIdDependentSettings

    // shape
    shapeBy: {
        type: 'categorical', // ['categorical']
        variable: null,
        label: null,
        shapes: ['circle', 'square', 'triangle', 'diamond', 'star', 'triangleDown'],
    },
    shape: 'circle',

    /**-------------------------------------------------------------------------------------------\
      animation
    \-------------------------------------------------------------------------------------------**/

    // animation settings
    speed: 'medium',
    speeds: {
        slow: 1000,
        medium: 500,
        fast: 100,
    },
    playPause: 'play',
    loop: true,
    delay: 5000,

    // time settings
    timepoint: 0, // initial timepoint
    timeUnit: 'days', // time unit that appears in labels
    duration: null, // defined in ./defineMetadata/updateIdDependentSettings
    resetDelay: 15000,

    /**-------------------------------------------------------------------------------------------\
      dimensions
    \-------------------------------------------------------------------------------------------**/

    width: null, // defined in ./defineMetadata/coordinates
    height: null, // defined in ./defineMetadata/coordinates
    orbitRadius: null, // defined in ./defineMetadata/coordinates

    /**-------------------------------------------------------------------------------------------\
      force simulation
    \-------------------------------------------------------------------------------------------**/

    manyBody: 'forceManyBodyReuse', // ['forceManyBody', 'forceManyBodyReuse', 'forceManyBodySampled']
    chargeStrength: null, // defined in ./defineMetadata/updateIdDependentSettings
    collisionPadding: 1,
    staticChargeStrength: null, // defined in ./defineMetadata/updateIdDependentSettings
    drawStaticSeparately: false, // draw static bubbles in a static force simulation to improve performance
    staticLayout: 'circular', // ['circular', 'radial']

    /**-------------------------------------------------------------------------------------------\
      modal
    \-------------------------------------------------------------------------------------------**/

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

    /**-------------------------------------------------------------------------------------------\
      event/state
    \-------------------------------------------------------------------------------------------**/

    events: null, // defined in ./defineMetadata
    eventLabel: 'Events',
    eventCentral: null, // defined in ./defineMetadata/updateEventDependentSettings
    eventCount: true, // display [ n (%) ] beneath focus labels?
    eventCountType: 'current-id', // ['current-id', 'cumulative-id', 'cumulative-event']
    eventChangeCount: null, // defined in ./defineMetadata/updateEventDependentSettings

    /**-------------------------------------------------------------------------------------------\
      miscellaneous
    \-------------------------------------------------------------------------------------------**/

    nOrbits: null, // defined in ./defineMetadata/dataDrivenSettings/orbits
    nFoci: null, // defined in ./defineMetadata/updateEventDependentSettings
    hideControls: false,
    hideFreqTable: false,
    eventCentralInFreqTable: false,
    focusOffset: 'heuristic', // ['heuristic', 'vertical']
};

export default settings;
