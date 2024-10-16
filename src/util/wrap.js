export default function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            fontStyle = text.style('font-size'),
            fontSize = parseFloat(fontStyle),
            fontUnit = fontStyle.replace(fontSize, ''),
            x = text.attr('x'),
            y = text.attr('y'),
            dy = parseFloat(text.attr('dy')),
            tspan = text
                .text(null)
                .append('tspan')
                .attr('x', x)
                .attr('y', y)
                .attr('dy', dy + 'rem');
        while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                tspan = text
                    .append('tspan')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('dy', ++lineNumber * fontSize + dy + fontUnit)
                    .text(word);
            }
        }
    });
}
