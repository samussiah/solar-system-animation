import legendTable from './legendTable';
import circle from './shape/circle';
import square from './shape/square';
import triangle from './shape/triangle';
import diamond from './shape/diamond';
import star from './shape/star';
import triangleDown from './shape/triangleDown';

export default function shape() {
    const main = this;

    let container;

    if (this.settings.shapify) {
        container = legendTable
            .call(this, this.settings.shapeBy.label, this.scales.shape.domain())
            .classed(
                `fdg-legend fdg-legend--shape fdg-legend--${this.settings.shapeBy.type}`,
                true
            );

        // Draw symbols
        const shapes = {
            circle,
            square,
            triangle,
            diamond,
            star,
            triangleDown,
        };
        container.symbols.each(function (value, i) {
            const shape = shapes[main.scales.shape(value)]
                .call(main, d3.select(this))
                .classed('fdg-legend__shape', true)
                .classed('fdg-legend__symbol', true);
        });

        // Update counts.
        container.counts.text((d) =>
            d3.format(',d')(this.metadata.id.filter((di) => di.shapeStratum === d).length)
        );
    }

    return container;
}
