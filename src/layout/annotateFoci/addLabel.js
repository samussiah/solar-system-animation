import getTextAnchor from './x/getPosition';

export default function addLabel(text) {
    const label = text
        .append('tspan')
        .classed('fdg-focus-annotation__label', true)
        .attr('x', 0)
        .attr('text-anchor', (d) => getTextAnchor.call(this, d))
        .text((d) => d.value);

    return label;
}
