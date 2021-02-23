// TODO: use some kind of cos/sin shit to make a perfect equilateral triangle
export default function triangle(d) {
    const ctx = this.layout.canvas.context;

    const side = d.value.size * 2; // * Math.sqrt(3)/6;
    const dist = side / Math.sqrt(3);

    const centroid = [d.x, d.y];
    const top = [d.x, d.y - dist];
    const left = [d.x - dist, d.y + dist];
    const right = [d.x + dist, d.y + dist];

    ctx.moveTo(...top);
    ctx.lineTo(...left);
    ctx.lineTo(...right);
    ctx.lineTo(...top);

    if (this.settings.fill) {
        this.layout.canvas.context.fillStyle = d.value.fill;
        this.layout.canvas.context.fill();
    }

    this.layout.canvas.context.strokeStyle = d.value.stroke;
    this.layout.canvas.context.stroke();
}
