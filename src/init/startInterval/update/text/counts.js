// Update focus percentages.
export default function counts() {
    if (this.settings.eventCount)
        this.focusAnnotations
            .selectAll('tspan.fdg-focus-annotation__event-count')
            .text((d) => d.fmt.numeratorPercent);

    if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify)
        this.metadata.event.forEach((event) => {
            event.fociLabels.selectAll('text').text((d) => d.fmt.numeratorPercent);
        });
}
