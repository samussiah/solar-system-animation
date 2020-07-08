export default function addFociLabels() {
    const fdg = this;

    // Activity labels
    const text = this.svg
        .selectAll('text')
        .data(this.settings.eventTypes)
        .enter()
        .append('text')
        .attr('class', 'actlabel')
        .attr('x', function (d, i) {
            if (d.desc == fdg.settings.centerEventType) {
                return fdg.settings.centerCoordinates.x;
            } else {
                var theta = (2 * Math.PI) / (fdg.settings.eventTypes.length - 1);
                return (i * 100 + 50) * Math.cos(i * theta) + 380;
                //return 340 * Math.cos(i * theta)+380;
            }
        })
        .attr('y', function (d, i) {
            if (d.desc == fdg.settings.centerEventType) {
                return fdg.settings.centerCoordinates.y;
            } else {
                var theta = (2 * Math.PI) / (fdg.settings.eventTypes.length - 1);
                return (i * 100 + 50) * Math.sin(i * theta) + 365;
                //return 340 * Math.sin(i * theta)+365;
            }
        });

    const label = text
        .append('tspan')
        .attr('x', function () {
            return d3.select(this.parentNode).attr('x');
        })
        // .attr("dy", "1.3em")
        .attr('text-anchor', 'middle')
        .text(function (d) {
            return d.short;
        });

    const pct = text
        .append('tspan')
        .attr('dy', '1.3em')
        .attr('x', function () {
            return d3.select(this.parentNode).attr('x');
        })
        .attr('text-anchor', 'middle')
        .attr('class', 'actpct')
        .text(function (d) {
            return fdg.settings.eventCounts[d.index] + '%';
        });

    return text;
}
