import getTextAnchor from './x/getPosition';
import getAlignmentBaseline from './y/getPosition';

export default function addLabel(text) {
    const label = text
        .append('tspan')
        .classed('fdg-focus-annotation__label', true)
        .attr('x', 0)
        .attr('text-anchor', (d) => getTextAnchor.call(this, d))
        .text((d) => d.value);
    if (this.settings.colorBy.type === 'categorical')
        label.attr('alignment-baseline', (d) => getAlignmentBaseline.call(this, d, true));

    return label;
}
