export default function ramp(color, n = 256) {
    //DOM.canvas(n, 1);
    const canvas = document.createElement('canvas');
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext('2d');

    for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 1, 1);
    }

    return canvas;
}
