import getTextAnchor from './annotateFoci/x/getPosition';
import getDx from './annotateFoci/x/getRelative';
import getAlignmentBaseline from './annotateFoci/y/getPosition';
import getDy from './annotateFoci/y/getRelative';

import addLabel from './annotateFoci/addLabel';
import addEventCount from './annotateFoci/addEventCount';
import categoricallyReposition from './annotateFoci/categoricallyReposition';

export default function annotateCustom() {
    let annotations;

    if (this.settings.annotations && Array.isArray(this.settings.annotations)) {
        console.log(this.settings.annotations);

        this.settings.annotations.forEach(annotation => {
            annotation.radius = annotation.orbit * this.settings.orbitRadius;
            annotation.theta = (2 * Math.PI * annotation.angle) / 360;
            annotation.x = this.settings.center.x +
                    annotation.radius * // number of orbit radii from the center
                        Math.cos(annotation.theta); // position along the circle at the given orbit along which
            annotation.y =
                annotation.order === 0
                    ? this.settings.center.y
                    : this.settings.center.y +
                    annotation.radius * // number of orbit radii from the center
                        Math.sin(annotation.theta); // y-position of the along the given orbit at which the focus circle at the
        });

        annotations = this.containers.customAnnotations
            .selectAll('g.fdg-custom-annotation')
            .data(this.settings.annotations)
            .join('g')
            .classed('fdg-custom-annotation', true)
            .attr('transform', (d) => `translate(${d.x},${d.y})`);

        ['background', 'foreground'].forEach((pos) => {
            console.log(pos);
            const text = annotations
                .append('text')
                .classed(`fdg-focus-annotation__text fdg-focus-annotation__${pos}`, true)
                .attr('alignment-baseline', d => d.angle > 0 ? 'hanging' : d.angle < 0 ? 'baseline' : 'middle')
                .attr('dx', d => d.dx || null)
                .attr('dy', d => d.dy || null)
                .text(d => d.label);
            console.log(text);
        });
    }

    return annotations;
}
