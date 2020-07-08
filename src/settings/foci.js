export default function foci(settings) {
    const foci = settings.eventTypes.reduce((foci, eventType, i) => {
        if (eventType.desc === settings.centerEventType) {
            foci[eventType.index] = Object.assign({}, settings.centerCoordinates);
        } else {
            const theta = (2 * Math.PI) / (settings.eventTypes.length - 1);
            //foci[eventType.index] = {x: settings.centerCoordinates.x + (i+1)*100, y: settings.centerCoordinates.y};
            foci[eventType.index] = {
                x: (i * 100 + 50) * Math.cos(i * theta) + 380,
                y: (i * 100 + 50) * Math.sin(i * theta) + 365,
            };
        }

        return foci;
    }, {});

    return foci;
}
