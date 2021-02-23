export default function states() {
    return {
        events: null, // defined in ./defineMetadata
        individualUnit: 'individual',
        individualLabel: 'Individuals',
        eventCentral: null, // defined in ./defineMetadata/updateEventDependentSettings
        eventCount: true, // display [ n (%) ] beneath focus labels?
        eventCountType: 'current-id', // ['current-id', 'cumulative-id', 'cumulative-event']
        eventChangeCount: null, // defined in ./defineMetadata/updateEventDependentSettings
    };
}
