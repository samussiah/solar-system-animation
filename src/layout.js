import layoutControls from './layout/controls';
import layoutSidebar from './layout/sidebar';
import layoutCanvas from './layout/canvas';
import resize from './layout/resize';

export default function layout() {
    const main = this.util.addElement('main', d3.select(this.element)).datum(this);

    for (const prop in this.settings.root) {
        console.log(prop);
        document.querySelector(':root').style.setProperty(`--${prop}`, this.settings.root[prop]);
    }

    // controls positioned absolutely
    const controls = layoutControls.call(this, main);

    // sidebar to the left
    const sidebar = layoutSidebar.call(this, main);

    // animation to the right
    const canvas = layoutCanvas.call(this, main);

    // add resize event
    window.addEventListener('resize', resize.bind(this));

    return {
        main,
        ...controls,
        ...sidebar,
        ...canvas,
    };
}
