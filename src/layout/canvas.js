import addElement from './addElement';

export default function canvas(main) {
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
        animation,
        svgBackground,
        canvas,
        svgForeground,
        modal,
    };
}
