// Update focus percentages.
export default function counts() {
    if (this.settings.eventCount)
        this.focusAnnotations
            .selectAll('tspan.fdg-focus-annotation__event-count')
            .text((d) =>
                this.settings.eventCountType === 'cumulative-event'
                    ? d.fmt.eventNumerator
                    : d.fmt.idNumeratorPercent
            );

    if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify)
        this.metadata.event.forEach((event) => {
            event.fociLabels
                .selectAll('text')
                .text((d) =>
                    this.settings.eventCountType === 'cumulative-event'
                        ? d.fmt.eventNumeratorPercent
                        : d.fmt.idNumeratorPercent
                );
        });
}
