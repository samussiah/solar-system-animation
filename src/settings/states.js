export default function states() {
    return {
        events: null, // defined in ./defineMetadata
        individualUnit: 'individual',
        individualLabel: 'Individuals',
        eventUnit: 'event',
        eventLabel: 'Events',
        eventCentral: null, // defined in ./defineMetadata/updateEventDependentSettings
        eventCount: true, // display [ n (%) ] beneath focus labels?
        eventCountType: 'current-id', // ['current-id', 'cumulative-id', 'cumulative-event']
        eventChangeCount: null, // defined in ./defineMetadata/updateEventDependentSettings
        eventLabelFontWeight: 'bold',
        eventLabelFontSize: '1.5rem',
        eventCountFontWeight: 'bold',
        eventCountFontSize: '1rem',
        eventFocusLabelChange: null, // array of objects with old label, new label, and timepoint
    };
}
