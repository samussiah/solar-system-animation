export default function calculateInitialPointCoordinates(populationEvent) {
    // Define a random angle and a random radius with which to initialize point coordinates.
    const r = Math.sqrt(~~(Math.random() * this.settings.R * this.settings.R));
    const theta = Math.random() * 2 * Math.PI;

    // Calculate source and destination coordinates.
    const pointCoordinates = {
        sx: populationEvent.x + r * Math.cos(theta),
        sy: populationEvent.y + r * Math.sin(theta),
        tx: populationEvent.x,
        ty: populationEvent.y,
    };

    return pointCoordinates;
}
