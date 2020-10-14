import continuous from './addLegends/makeLegend/continuous';
//import categorical from './addLegends/makeLegend/categorical';
import makeLegend from './addLegends/makeLegend';

export default function addLegends() {
    this.legends = {
        container: this.containers.legends,
    };

    if (this.settings.colorBy.type === 'continuous') {
        const container = this.legends.container
            .append('div')
            .classed('fdg-legend fdg-legend--continuous', true);
        container.node().appendChild(
            continuous({
                color: this.colorScale,
                title: this.settings.colorBy.label,
                width: 200,
                height: 50,
                tickValues: [
                    this.colorScale.domain()[0],
                    (this.colorScale.domain()[1] - this.colorScale.domain()[0]) / 2,
                    this.colorScale.domain()[1],
                ],
            })
        );
    } else if (this.settings.colorBy.type === 'categorical') {
        const container = this.legends.container
            .append('div')
            .classed('fdg-legend fdg-legend--categorical', true);
        container
            .append('div')
            .classed('fdg-sidebar__label fdg-legend__label', true)
            .text(this.settings.colorBy.label);
        const legendItems = container
            .append('svg')
            .attr('width', 200)
            .attr('height', 20 * this.colorScale.domain().length)
            .selectAll('g')
            .data(this.colorScale.domain())
            .join('g');
        legendItems
            .append('circle')
            .attr('cx', 20)
            .attr('cy', (d, i) => i * 20 + 10)
            .attr('r', 7)
            .attr('fill', (d) => this.colorScale(d));
        legendItems
            .append('text')
            .attr('font-size', '1rem')
            .attr('x', 35)
            .attr('y', (d, i) => i * 20 + 12)
            .attr('alignment-baseline', 'middle')
            .text((d) => `${d} (n=${this.metadata.id.filter((di) => di.category === d).length})`);
    } else if (this.settings.colorBy.type === 'frequency') {
        this.legends.color = makeLegend.call(this, 'color');
        this.legends.size = makeLegend.call(this, 'size');
        this.legends.both = makeLegend.call(this, 'both');
    }
}
