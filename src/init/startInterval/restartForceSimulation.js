export default function restartForceSimulation() {
    this.metadata.event.forEach((event) => {
        // Center points initially then remove centering force.
        if (this.settings.timepoint === 1) event.forceSimulation.force('center', null);
        event.forceSimulation.nodes(event.data);
        event.forceSimulation.alpha(1).restart();
    });
}
