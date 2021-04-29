import getTextAnchor from './annotateFoci/x/getPosition';
import getDx from './annotateFoci/x/getRelative';
import getAlignmentBaseline from './annotateFoci/y/getPosition';
import getDy from './annotateFoci/y/getRelative';

import addLabel from './annotateFoci/addLabel';
import addEventCount from './annotateFoci/addEventCount';
import categoricallyReposition from './annotateFoci/categoricallyReposition';

export default function addFocusAnnotations() {
    const main = this;

    // Define a radial gradient background to emphasize annotation text.
    //const radialGradient = this.layout.focusAnnotations
    //    .append('defs')
    //    .append('radialGradient')
    //    .attr('id', 'radial-gradient');
    //radialGradient.append('stop')
    //    .attr('offset', '0%')
    //    .attr('stop-color', '#aaa')
    //    .attr('stop-opacity', 1);
    //radialGradient.append('stop')
    //    .attr('offset', '100%')
    //    .attr('stop-color', 'white')
    //    .attr('stop-opacity', 0);

    const fociLabels = this.layout.focusAnnotations
        .selectAll('g.fdg-focus-annotation')
        .data(this.metadata.event)
        .join('g')
        .classed('fdg-focus-annotation', true)
        .attr('transform', (d) => `translate(${d.x},${d.y})`);

    // background - white annotation highlight
    // foreground - black annotation text
    ['background', 'foreground'].forEach((pos) => {
        const texts = fociLabels
            .append('text')
            .classed(`fdg-focus-annotation__text fdg-focus-annotation__${pos}`, true);

        texts.each(function (d, i) {
            const text = d3.select(this);
            text.attr(
                'transform',
                (d) => `translate(${getDx.call(main, d)},${getDy.call(main, d)})`
            );
        });
        const label = addLabel.call(this, texts).attr('y', 0).attr('dy', 0);
        this.util.wrap(label, this.settings.orbitRadius);
        const eventCount = addEventCount.call(this, texts);

        // Position annotations differently in categorical layout.
        categoricallyReposition.call(this, texts, label, eventCount);
    });

    // Annotate strata at each focus.
    if (this.settings.colorBy.type === 'categorical' && this.settings.colorBy.stratify) {
        this.metadata.event.forEach((event) => {
            event.fociLabels = this.layout.focusAnnotations
                .append('g')
                .classed('fdg-focus-annotation fdg-focus-annotation--categorical', true);

            ['background', 'foreground'].forEach((pos) => {
                const texts = event.fociLabels
                    .selectAll(`text.fdg-focus-annotation__${pos}`)
                    .data(event.foci)
                    .join('text')
                    .classed(
                        `fdg-focus-annotation__event-count fdg-focus-annotation__text fdg-focus-annotation__${pos}`,
                        true
                    )
                    .attr('x', (d) => d.dx)
                    .attr('dx', (d) => (event.key === this.settings.eventCentral ? null : '-1em'))
                    .attr('y', (d) => d.dy)
                    .attr('text-anchor', (d) =>
                        event.key === this.settings.eventCentral ? 'middle' : 'end'
                    )
                    .attr('alignment-baseline', (d) => getAlignmentBaseline.call(this, d, true));
            });
        });
    }

    // Add a radial gradient behind annotations to make text easier to read.
    //const offset = 50;
    //fociLabels.each(function(d) {
    //    const g = d3.select(this);
    //    const dimensions = this.getBBox();
    //    const rect = g
    //        .insert('rect', ':first-child')
    //        .attr('x', dimensions.x - offset)
    //        .attr('y', dimensions.y - offset)
    //        .attr('width', dimensions.width + offset*2)
    //        .attr('height', dimensions.height + offset*2)
    //        .attr('fill', 'url(#radial-gradient)')
    //        //.attr('transform', text.attr('transform'));
    //});

    return fociLabels;
}
