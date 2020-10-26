export default function restartForceSimulation() {
    //this.worker.postMessage({type: 'reheat'});
    if (this.settings.timepoint === 1) this.forceSimulation.force('center', null);
    this.forceSimulation.alpha(1)
        .force('x', d3.forceX().x(d => d.value.coordinates.x).strength(0.3))
        .force('y', d3.forceY().y(d => d.value.coordinates.y).strength(0.3))
        .restart();
    //this.metadata.event.forEach((event) => {
    //    event.forceSimulation.forEach((forceSimulation) => {
    //        // Center points initially then remove centering force.
    //        if (this.settings.timepoint === 1) forceSimulation.force('center', null);

    //        // Update data.
    //        forceSimulation.nodes(
    //            event.data.filter(
    //                (d) => !d.value.noStateChange && d.value.category === forceSimulation.category
    //            )
    //        );

    //        // Reheat simulation.
    //        forceSimulation.alpha(1).restart();
    //    });
    //});

    //const nIntervals = 30;
    //const intervalLength = this.settings.speeds[this.settings.speed]/nIntervals;
    //let counter = 0;
    //const interval = d3.interval(() => {
    //    if (counter < nIntervals) {
    //        this.containers.canvas.context.clearRect(0, 0, this.settings.width, this.settings.height);
    //        this.containers.canvas.context.save();

    //        this.data.nested
    //            .sort((a, b) => a.value.stateChanges - b.value.stateChanges) // draw bubbles with more state changes last
    //            .forEach((d, i) => {
    //                this.containers.canvas.context.beginPath();

    //                // circle
    //                //if (this.settings.shape === 'circle') {
    //                //if (i % 2) {
    //                this.containers.canvas.context.moveTo(d.x + d.r, d.y);
    //                this.containers.canvas.context.arc(d.x, d.y, d.value.r, 0, 2 * Math.PI);
    //                if (this.settings.fill) {
    //                    this.containers.canvas.context.fillStyle = d.value.fill;
    //                    this.containers.canvas.context.fill();
    //                }
    //                this.containers.canvas.context.strokeStyle = d.value.stroke;
    //                this.containers.canvas.context.stroke();
    //                //}
    //                // square
    //                //else {
    //                //    //this.containers.canvas.context.moveTo(d.x + d.r, d.y);
    //                //    this.containers.canvas.context.rect(
    //                //        d.x - d.value.r,
    //                //        d.y - d.value.r,
    //                //        d.value.r * 2,
    //                //        d.value.r * 2
    //                //    );
    //                //    if (this.settings.fill) {
    //                //        this.containers.canvas.context.fillStyle = d.value.fill;
    //                //        this.containers.canvas.context.fill();
    //                //    }
    //                //    this.containers.canvas.context.strokeStyle = d.value.stroke;
    //                //    this.containers.canvas.context.stroke();
    //                //}
    //            });

    //        this.containers.canvas.context.restore();
    //    } else interval.stop();
    //    counter++;
    //}, intervalLength);
}
