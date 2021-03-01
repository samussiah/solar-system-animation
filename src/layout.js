import layoutControls from './layout/controls';
import layoutSidebar from './layout/sidebar';
import layoutCanvas from './layout/canvas';
import resize from './layout/resize';
import dataDriven from './layout/dataDriven';

export default function layout() {
    const main = this.util.addElement('main', d3.select(this.element)).datum(this);
    this.settings.width = {
        main: main.node().clientWidth,
    };
    this.settings.height = {
        main: main.node().clientHeight,
    };

    for (const prop in this.settings.root) {
        document.querySelector(':root').style
            .setProperty(`--${prop}`, this.settings.root[prop], 'important');
    }

    // controls positioned absolutely
    const controlsLayout = layoutControls.call(this, main);

    // sidebar to the left
    const sidebarLayout = layoutSidebar.call(this, main);

    // animation to the right
    const canvasLayout = layoutCanvas.call(this, main);

    // add resize event
    window.addEventListener('resize', resize.bind(this));

    return {
        main,
        ...controlsLayout,
        ...sidebarLayout,
        ...canvasLayout,
        dataDriven,
    };
}
