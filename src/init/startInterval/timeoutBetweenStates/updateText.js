export default function updateText() {
    if (this.settings.timepoint < this.settings.duration) {
        if (
            this.prevEvent === undefined ||
            this.currEvent.orbitLabel !== this.prevEvent.orbitLabel
        ) {
            this.containers.sequenceOverlay.background.sequence
                .style('opacity', 1)
                .transition()
                .duration(this.settings.modalSpeed / 5)
                .style('opacity', 0)
                .on('end', () => {
                    this.containers.sequenceOverlay.background.sequence
                        .html(this.currEvent.orbitLabel || this.currEvent.key)
                        .style('opacity', 0)
                        .transition()
                        .duration(this.settings.modalSpeed / 5)
                        .style('opacity', 1);
                });

            this.containers.sequenceOverlay.foreground.sequence
                .style('opacity', 1)
                .transition()
                .duration(this.settings.modalSpeed / 5)
                .style('opacity', 0)
                .on('end', () => {
                    this.containers.sequenceOverlay.foreground.sequence
                        .html(this.currEvent.orbitLabel || this.currEvent.key)
                        .style('opacity', 0)
                        .transition()
                        .duration(this.settings.modalSpeed / 5)
                        .style('opacity', 1);
                });
        }

        if (this.currEvent.orbitLabel && this.currEvent.key) {
            this.containers.sequenceOverlay.background.event
                .style('opacity', 1)
                .transition()
                .duration(this.settings.modalSpeed / 5)
                .style('opacity', 0)
                .on('end', () => {
                    this.containers.sequenceOverlay.background.event
                        .html(this.currEvent.key)
                        .style('opacity', 0)
                        .transition()
                        .duration(this.settings.modalSpeed / 5)
                        .style('opacity', 1);
                });

            this.containers.sequenceOverlay.foreground.event
                .style('opacity', 1)
                .transition()
                .duration(this.settings.modalSpeed / 5)
                .style('opacity', 0)
                .on('end', () => {
                    this.containers.sequenceOverlay.foreground.event
                        .html(this.currEvent.key)
                        .style('opacity', 0)
                        .transition()
                        .duration(this.settings.modalSpeed / 5)
                        .style('opacity', 1);
                });
        }
    } else {
        this.containers.sequenceOverlay.background.sequence
            .style('opacity', 1)
            .transition()
            .duration(this.settings.modalSpeed / 5)
            .style('opacity', 0)
            .on('end', () => this.containers.sequenceOverlay.background.sequence.html(null));
        this.containers.sequenceOverlay.foreground.sequence
            .style('opacity', 1)
            .transition()
            .duration(this.settings.modalSpeed / 5)
            .style('opacity', 0)
            .on('end', () => this.containers.sequenceOverlay.foreground.sequence.html(null));
        this.containers.sequenceOverlay.background.event
            .style('opacity', 1)
            .transition()
            .duration(this.settings.modalSpeed / 5)
            .style('opacity', 0)
            .on('end', () => this.containers.sequenceOverlay.background.event.html(null));
        this.containers.sequenceOverlay.foreground.event
            .style('opacity', 1)
            .transition()
            .duration(this.settings.modalSpeed / 5)
            .style('opacity', 0)
            .on('end', () => this.containers.sequenceOverlay.foreground.event.html(null));
    }
}
