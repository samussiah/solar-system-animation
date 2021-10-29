export default function updateText() {
    if (this.settings.timepoint < this.settings.duration) {
        if (
            this.prevEvent === undefined ||
            this.currEvent.orbitLabel !== this.prevEvent.orbitLabel
        ) {
            this.layout.sequenceOverlay.background.sequence
                .style('opacity', 1)
                .transition()
                .duration(this.settings.modalSpeed / 5)
                .style('opacity', 0)
                .on('end', () => {
                    this.layout.sequenceOverlay.background.sequence
                        .html(this.currEvent.orbitLabel || this.currEvent.key)
                        .style('opacity', 0)
                        .transition()
                        .duration(this.settings.modalSpeed / 5)
                        .style('opacity', 1);
                });

            this.layout.sequenceOverlay.foreground.sequence
                .style('opacity', 1)
                .transition()
                .duration(this.settings.modalSpeed / 5)
                .style('opacity', 0)
                .on('end', () => {
                    this.layout.sequenceOverlay.foreground.sequence
                        .html(this.currEvent.orbitLabel || this.currEvent.key)
                        .style('opacity', 0)
                        .transition()
                        .duration(this.settings.modalSpeed / 5)
                        .style('opacity', 1);
                });
        }

        if (this.currEvent.orbitLabel && this.currEvent.key) {
            this.layout.sequenceOverlay.background.event
                .style('opacity', 1)
                .transition()
                .duration(this.settings.modalSpeed / 5)
                .style('opacity', 0)
                .on('end', () => {
                    this.layout.sequenceOverlay.background.event
                        .html(this.currEvent.key)
                        .style('opacity', 0)
                        .transition()
                        .duration(this.settings.modalSpeed / 5)
                        .style('opacity', 1);
                });

            this.layout.sequenceOverlay.foreground.event
                .style('opacity', 1)
                .transition()
                .duration(this.settings.modalSpeed / 5)
                .style('opacity', 0)
                .on('end', () => {
                    this.layout.sequenceOverlay.foreground.event
                        .html(this.currEvent.key)
                        .style('opacity', 0)
                        .transition()
                        .duration(this.settings.modalSpeed / 5)
                        .style('opacity', 1);
                });
        }
    } else {
        this.layout.sequenceOverlay.background.sequence
            .style('opacity', 1)
            .transition()
            .duration(this.settings.modalSpeed / 5)
            .style('opacity', 0)
            .on('end', () => this.layout.sequenceOverlay.background.sequence.html(null));
        this.layout.sequenceOverlay.foreground.sequence
            .style('opacity', 1)
            .transition()
            .duration(this.settings.modalSpeed / 5)
            .style('opacity', 0)
            .on('end', () => this.layout.sequenceOverlay.foreground.sequence.html(null));
        this.layout.sequenceOverlay.background.event
            .style('opacity', 1)
            .transition()
            .duration(this.settings.modalSpeed / 5)
            .style('opacity', 0)
            .on('end', () => this.layout.sequenceOverlay.background.event.html(null));
        this.layout.sequenceOverlay.foreground.event
            .style('opacity', 1)
            .transition()
            .duration(this.settings.modalSpeed / 5)
            .style('opacity', 0)
            .on('end', () => this.layout.sequenceOverlay.foreground.event.html(null));
    }
}
