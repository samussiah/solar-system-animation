export default function addSpeedControl() {
    const fdg = this;

    const speedControl = d3.selectAll('.togglebutton').on('click', function () {
        if (d3.select(this).attr('data-val') == 'slow') {
            d3.select('.slow').classed('current', true);
            d3.select('.medium').classed('current', false);
            d3.select('.fast').classed('current', false);
        } else if (d3.select(this).attr('data-val') == 'medium') {
            d3.select('.slow').classed('current', false);
            d3.select('.medium').classed('current', true);
            d3.select('.fast').classed('current', false);
        } else {
            d3.select('.slow').classed('current', false);
            d3.select('.medium').classed('current', false);
            d3.select('.fast').classed('current', true);
        }

        fdg.settings.speed = d3.select(this).attr('data-val');
    });

    return speedControl;
}
