import makeLegendMarks from './makeLegend/index';

export default function makeLegend(type) {
    const legendDimensions = [200, 50];

    // container
    const container = this.legends.container
        .append('div')
        .classed(`fdg-legend fdg-legend--${type}`, true)
        .classed(
            'fdg-hidden',
            this.settings.eventChangeCountAesthetic !== type ||
                this.settings.eventChangeCount.length === 0
        );

    // label
    const label = container
        .append('div')
        .classed('fdg-legend__label', true)
        //.style('width', legendDimensions[0] + 'px')
        .html(
            `Number of <span class = "fdg-measure">${this.util.csv(
                this.settings.eventChangeCount
            )}</span> events`
        );

    // svg
    const svg = container
        .append('svg')
        .attr('width', legendDimensions[0])
        .attr('height', legendDimensions[1])
        .append('g');

    // marks
    const marks = makeLegendMarks[type].call(this, svg, legendDimensions);

    // lower end of scale
    const lower = svg
        .append('text')
        .attr('x', legendDimensions[0] / this.settings.colors().length / 2)
        .attr('y', legendDimensions[1] / 2 + 16)
        .attr('text-anchor', 'middle')
        .text('0');

    // upper end of scale
    const upper = svg
        .append('text')
        .attr('x', legendDimensions[0] - legendDimensions[0] / this.settings.colors().length / 2)
        .attr('y', legendDimensions[1] / 2 + 16)
        .attr('text-anchor', 'middle')
        .text(`${this.settings.colors().length - 1}+`);

    return {
        container,
        label,
        svg,
        marks,
        lower,
        upper,
    };
}
