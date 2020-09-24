import addElement from './layout/addElement';
import layoutControls from './layout/controls';
import layoutSidebar from './layout/sidebar';
import layoutCanvas from './layout/canvas';

export default function layout() {
    const main = addElement('main', d3.select(this.element));

    // controls on top
    const controls = layoutControls.call(this, main);

    // sidebar to the left
    const sidebar = layoutSidebar.call(this, main);

    // animation to the right
    const canvas = layoutCanvas.call(this, main);

    return {
        main,
        ...controls,
        ...sidebar,
        ...canvas,
    };
}
