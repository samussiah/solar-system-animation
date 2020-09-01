import addElement from './layout/addElement';

export default function layout() {
    const fdg = this;

    const main = addElement('main', d3.select(this.element));

    // controls on top
    const controls = addElement('controls', main);

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
    if (this.settings.animationOnly) {
        main.selectAll('*').classed('fdg-hidden', true);
        timer.classed('fdg-hidden', false);
        timer.selectAll('*').classed('fdg-hidden', false);
        timer.style('position', 'absolute').style('left', '5%').style('top', '25%').style('text-align', 'left');
        main.style('position', 'relative').node().appendChild(timer.node());
    }

    const animation = addElement('animation', main);
    if (this.settings.animationOnly)
        animation.style('width', '100%').style('height', '100vh').style('border-left', 'unset');
    this.settings.width = animation.node().clientWidth;
    this.settings.height = this.settings.animationOnly
        ? animation.node().clientHeight//window.innerHeight
        : (this.settings.width / 21) * 9;

    // offscreen canvas
    //const n = this.settings.colors().length;
    //console.log(n);
    //const r = 3;
    //console.log(r);
    //const d = r * 2;
    //console.log(d);
    //const offscreenCanvas = addElement('canvas-offscreen', animation, 'canvas')
    //    .attr('width', n * d)
    //    .attr('height', d);
    //console.log(offscreenCanvas.attr('width'));
    //console.log(offscreenCanvas.attr('height'));
    //console.log(offscreenCanvas);
    //offscreenCanvas.context = offscreenCanvas.node().getContext('2d');

    //for (var i = 0; i < n; ++i) {
    //    offscreenCanvas.context.fillStyle = this.settings.colors()[i];
    //    offscreenCanvas.context.beginPath();
    //    offscreenCanvas.context.arc(i * d + r, r, r, 0, 2 * Math.PI);
    //    offscreenCanvas.context.closePath();
    //    offscreenCanvas.context.fill();
    //}

    // canvas
    const canvas = addElement('canvas', animation, 'canvas')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    console.log(canvas.attr('width'));
    console.log(canvas.attr('height'));
    console.log(canvas);
    canvas.context = canvas.node().getContext('2d');

    // SVG
    const svg = addElement('svg', animation, 'svg')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    sidebar.style('height', `${this.settings.height}px`);

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
        //offscreenCanvas,
        canvas,
        svg,
    };
}
