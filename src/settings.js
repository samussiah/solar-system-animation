import update from './settings/update';

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

    // event settings
    events: null, // defined in ./defineMetadata
    eventCentral: null, // defined in ./defineMetadata/updateEventDependentSettings
    eventCount: true, // display [ n (%) ] beneath focus labels?
    eventChangeCount: null, // defined in ./defineMetadata/updateEventDependentSettings
    eventChangeCountAesthetic: 'color',

    /**-------------------------------------------------------------------------------------------\
      Aesthetics
    \-------------------------------------------------------------------------------------------**/

        // bubble color settings
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

        // bubble size settings
        sizeBy: {
            type: 'frequency', // ['frequency', 'continuous']
            variable: null,
            label: null,
        },
        minRadius: null, // defined in ./defineMetadata/updateIdDependentSettings
        maxRadius: 10, // defined in ./defineMetadata/updateIdDependentSettings
        staticRadius: null, // defined in ./defineMetadata/updateIdDependentSettings

        // bubble shape settings
        shapeBy: {
            type: 'categorical', // ['categorical']
            variable: null,
            label: null,
            shapes: [
                'cicle',
                'square',
                'triangle',
                'diamond'
            ],
        },
        shape: 'circle',

    // time settings
    timepoint: 0,
    timeUnit: 'days',
    duration: null, // defined in ./defineMetadata/updateIdDependentSettings
    resetDelay: 15000,

    // animation settings
    speed: 'medium',
    speeds: {
        slow: 1000,
        medium: 500,
        fast: 100,
    },
    playPause: 'play',
    pulseOrbits: false,
    loop: true,

    // dimensions
    width: null, // defined in ./defineMetadata/coordinates
    height: null, // defined in ./defineMetadata/coordinates
    padding: 1,
    nOrbits: null, // defined in ./defineMetadata/dataDrivenSettings/orbits
    orbitRadius: null, // defined in ./defineMetadata/coordinates
    nFoci: null, // defined in ./defineMetadata/updateEventDependentSettings
    translate: false,
    hideControls: false,

    // force simulation settings
    manyBody: 'forceManyBodyReuse', // ['forceManyBody', 'forceManyBodyReuse', 'forceManyBodySampled']
    chargeStrength: null, // defined in ./defineMetadata/updateIdDependentSettings
    collisionPadding: 1,
    staticChargeStrength: null, // defined in ./defineMetadata/updateIdDependentSettings
    drawStaticSeparately: false, // draw static bubbles in a static force simulation to improve performance
    staticLayout: 'circular', // ['circular', 'radial']

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
