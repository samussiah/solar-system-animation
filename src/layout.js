import addElement from './layout/addElement';

export default function layout() {
    const main = addElement('main', d3.select(this.element));

    // controls on top
    const controls = addElement('controls', main);

    // sidebar to the left
    const sidebar = addElement('sidebar', main);
    const timer = addElement('timer', sidebar);
    const timerDots = addElement('timer-dots', sidebar)
        .style('width', '100%')
        .style('text-align', 'center')
        .selectAll('div')
        .data(d3.range(this.settings.resetDelay/100))
        .join('span')
        .style('width', `${100/(this.settings.resetDelay/100)}%`)
        .style('display', 'inline-block')
        .text('.')
        .classed('fdg-hidden', true);
    const legends = addElement('legends', sidebar);
    const freqTable = addElement('freq-table', sidebar);
    const info = addElement('info', sidebar);

    // animation to the right
    const animation = addElement('animation', main);
    this.settings.width = animation.node().clientWidth;
    this.settings.height = this.settings.width / 21 * 9;
    const canvas = addElement('canvas', animation, 'canvas')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    canvas.context = canvas.node().getContext('2d');
    const svg = addElement('svg', animation, 'svg')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    sidebar.style('height', `${this.settings.height}px`);

    return {
        main,

        controls,

        sidebar,
        timer,
        timerDots,
        legends,
        freqTable,
        info,

        animation,
        canvas,
        svg,
    };
}
