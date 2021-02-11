export default function annotateCustom() {
    let annotations;

    if (this.settings.annotations && Array.isArray(this.settings.annotations)) {
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
            .classed('fdg-hidden', d => d.timepoint > this.settings.timepoint)
            .attr('transform', (d) => `translate(${d.x},${d.y})`);

        annotations.html(d => d.value);

        //['background', 'foreground'].forEach((pos) => {
        //    const text = annotations
        //        .append('text')
        //        .classed(`fdg-focus-annotation__text fdg-focus-annotation__${pos}`, true)
        //        .attr('alignment-baseline', d => d.angle > 0 ? 'hanging' : d.angle < 0 ? 'baseline' : 'middle')
        //        .html(d => d.value)
        //        .each(function(d) {
        //            const selection = d3.select(this);

        //            // Apply attributes.
        //            if (typeof d.attr === 'object' && d.attr !== null)
        //                Object.keys(d.attr).forEach(attr => {
        //                    selection.attr(attr, d.attr[attr]);
        //                });

        //            // Apply styles.
        //            if (typeof d.style === 'object' && d.style !== null)
        //                Object.keys(d.style).forEach(style => {
        //                    selection.style(style, d.style[style]);
        //                });
        //        });
        //});
    }

    return annotations;
}
