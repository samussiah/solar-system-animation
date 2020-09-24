import addElement from './layout/addElement';
import ProgressBar from 'progressbar.js';

// TODO: fit sidebar and animation containers to height of containing element less the height of the controls.
export default function layout() {
    const fdg = this;

    const main = addElement('main', d3.select(this.element));

    // controls on top
    const controls = addElement('controls', main).classed('fdg-hidden', this.settings.hideControls);

    // sidebar to the left
    const sidebar = addElement('sidebar', main);
    const legends = addElement('legends', sidebar);
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
    const progress = addElement('progress', sidebar);
    progress.circle = new ProgressBar.Circle(progress.node(), {
        color: '#aaa',
        strokeWidth: 4,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1400,
        text: {
            autoStyleContainer: false,
        },
        from: {
            color: '#aaa',
            width: 1,
        },
        to: {
            color: '#333',
            width: 4,
        },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            var value = Math.round(circle.value() * 100);
            if (value === 0) {
                circle.setText('');
            } else {
                circle.setText(value);
            }
        },
    });
    progress.circle.animate(.5);
    console.log(progress.circle);

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
    const freqTable = addElement('freq-table', sidebar);

    // animation to the right
    const animation = addElement('animation', main);
    this.settings.width = animation.node().clientWidth;
    this.settings.height = animation.node().clientHeight;

    // background SVG
    const svgBackground = addElement('svg--background', animation, 'svg')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    // canvas
    const canvas = addElement('canvas', animation, 'canvas')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    canvas.context = canvas.node().getContext('2d');

    // SVG
    const svgForeground = addElement('svg--foreground', animation, 'svg')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    // modal
    const modal = addElement('modal', animation);
    //.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec erat orci. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Phasellus ut pretium augue, vitae aliquam arcu. Etiam consequat, lectus sit amet volutpat auctor, dui libero consectetur magna, eu ultricies elit ex non dui. Maecenas quis lacus non enim gravida ultrices. Phasellus vitae orci eget libero tempor scelerisque. Nunc auctor ut mi in fringilla. Praesent blandit id est ut aliquet.');

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

        animation,
        svgBackground,
        canvas,
        svgForeground,
        modal,
    };
}
