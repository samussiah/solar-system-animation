import addElement from './layout/addElement';

export default function layout() {
    const fdg = this;

    const main = addElement('main', d3.select(this.element));

    // TODO: fit sidebar and animation containers to height of containing element less the height of the controls.
    // controls on top
    const controls = addElement('controls', main).classed('fdg-hidden', this.settings.hideControls);

    // sidebar to the left
    const sidebar = addElement('sidebar', main);
    const timing = addElement('timing', sidebar).style('position', 'relative');
    const timer = addElement('timer', timing);
    const slider = addElement('slider', timing, 'input')
        .attr('type', 'range')
        .attr('min', 0)
        .attr('value', 0)
        .property('disabled', true)
        .attr(
            'title',
            `The animation is ${d3.format('.1%')(
                this.settings.timepoint / this.settings.duration
            )} complete with ${this.settings.duration} ${
                this.settings.timeUnit.split(' ')[0]
            } to go.`
        );

    // TODO: make slider into a control - need to figure out a new way to count up the state changes up to the selected timepoint
    slider.on('change', function () {
        console.log(this.value);
        fdg.settings.timepoint = +this.value;
    });

    const countdown = addElement('countdown', timing)
        .style('height', '22px')
        .style('width', '100%')
        .style('text-align', 'center')
        .selectAll('div')
        .data(d3.range(-1, this.settings.resetDelay / 1000))
        .join('div')
        .style('width', '100%')
        .style('display', 'inline-block')
        .text((d) => `Looping in ${d + 1} second${d === 0 ? '' : 's'}`)
        .classed('fdg-hidden', true);
    const legends = addElement('legends', sidebar);
    const freqTable = addElement('freq-table', sidebar);
    const info = addElement('info', sidebar);

    // animation to the right
    const animation = addElement('animation', main);
    this.settings.width = animation.node().clientWidth;
    this.settings.height = animation.node().clientHeight;
    console.log(animation.node().clientHeight);
    console.log(animation.node().offsetHeight);
    console.log(animation.node().scrollHeight);
    console.log(animation.node());
    //? animation.node().clientHeight//window.innerHeight
    //: (this.settings.width / 21) * 9;

    // canvas
    const canvas = addElement('canvas', animation, 'canvas')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    canvas.context = canvas.node().getContext('2d');

    // SVG
    const svg = addElement('svg', animation, 'svg')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    //sidebar.style('height', `${this.settings.height}px`);

    return {
        main,

        controls,

        sidebar,
        timing,
        timer,
        slider,
        countdown,
        legends,
        freqTable,
        info,

        animation,
        canvas,
        svg,
    };
}
