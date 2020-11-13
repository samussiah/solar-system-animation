import getTextAnchor from './annotateFoci/x/getPosition';
import getDx from './annotateFoci/x/getRelative';
import getAlignmentBaseline from './annotateFoci/y/getPosition';
import getDy from './annotateFoci/y/getRelative';

import addLabel from './annotateFoci/addLabel';
import addEventCount from './annotateFoci/addEventCount';
import categoricallyReposition from './annotateFoci/categoricallyReposition';

export default function annotateFoci() {
    const fociLabels = this.containers.focusAnnotations
        .selectAll('g.fdg-focus-annotation')
        .data(this.metadata.event)
        .join('g')
        .classed('fdg-focus-annotation', true)
        .attr('transform', (d) => `translate(${d.x},${d.y})`);

    // background - white annotation highlight
    // foreground - black annotation text
    ['background', 'foreground'].forEach((pos) => {
        const text = fociLabels
            .append('text')
            .classed(`fdg-focus-annotation__text fdg-focus-annotation__${pos}`, true)
            .style('transform', (d) => `translate(${getDx.call(this, d)},${getDy.call(this, d)})`);
        const label = addLabel.call(this, text);
        const eventCount = addEventCount.call(this, text);

        // Position annotations differently in categorical layout.
        categoricallyReposition.call(this, text, label, eventCount);
    });

    if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
        this.metadata.event.forEach((event) => {
            event.fociLabels = this.containers.focusAnnotations
                .append('g')
                .classed('fdg-focus-annotation fdg-focus-annotation--categorical', true);

            ['background', 'foreground'].forEach((pos) => {
                const text = event.fociLabels
                    .selectAll(`text.fdg-focus-annotation__${pos}`)
                    .data(event.foci)
                    .join('text')
                    .classed(`fdg-focus-annotation__text fdg-focus-annotation__${pos}`, true)
                    .attr('x', (d) => d.dx)
                    .attr('dx', (d) => (event.value === this.settings.eventCentral ? null : '-1em'))
                    .attr('y', (d) => d.dy)
                    .attr('text-anchor', (d) =>
                        event.value === this.settings.eventCentral ? 'middle' : 'end'
                    )
                    .attr('alignment-baseline', (d) => getAlignmentBaseline.call(this, d, true));
            });
        });
    }

    return fociLabels;
}
