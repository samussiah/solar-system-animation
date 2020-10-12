export default function restartForceSimulation() {
    this.metadata.event.forEach((event) => {
        event.forceSimulation.forEach(forceSimulation => {
            // Center points initially then remove centering force.
            if (this.settings.timepoint === 1)
                forceSimulation.force('center', null);

            // Update data.
            forceSimulation.nodes(
                event.data.filter((d) => (
                    !d.value.noStateChange &&
                    d.value.category === forceSimulation.category
                ))
            );

            // Reheat simulation.
            forceSimulation.alpha(1).restart();
        });
    });
}
