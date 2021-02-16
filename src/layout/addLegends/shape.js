import circle from './shape/circle';
import square from './shape/square';
import triangle from './shape/triangle';
import diamond from './shape/diamond';
import star from './shape/star';
import triangleDown from './shape/triangleDown';

// TODO: figure out how to line wrap long labels
export default function shape() {
    let container;

    if (this.settings.shapify) {
        const main = this;
        const shapes = {
            circle,
            square,
            triangle,
            diamond,
            star,
            triangleDown,
        };
        container = this.legends.container
            .append('div')
            .classed(
                `fdg-legend fdg-legend--shape fdg-legend--${this.settings.shapeBy.type}`,
                true
            );
        container
            .append('div')
            .classed('fdg-sidebar__label fdg-legend__label', true)
            .html(this.settings.shapeBy.label);
        const legendItems = container
            .append('svg')
            .attr('width', 200)
            .attr('height', 20 * this.scales.shape.domain().length)
            .selectAll('g')
            .data(this.scales.shape.domain())
            .join('g')
            .attr('transform', 'translate(20,0)');
        const radius = 7;
        const spacing = 20;
        legendItems.each(function (value, i) {
            const shape = shapes[main.scales.shape(value)]
                .call(main, d3.select(this), i, spacing, radius)
                .classed('fdg-legend__shape', true)
                .classed('fdg-legend__symbol', true);
        });
        legendItems
            .append('text')
            .classed('fdg-legend__label', true)
            .attr('font-size', '1rem')
            .attr('x', 35)
            .attr('y', (d, i) => i * 20 + 12)
            .attr('dy', 0)
            .attr('alignment-baseline', 'middle')
            .html(
                (d) => `${d} (n=${this.metadata.id.filter((di) => di.shapeStratum === d).length})`
            );
        //.each(function(d) {
        //    const text = d3.select(this);
        //    main.util.wrap(text, 100);
        //});
    }

    return container;
}
