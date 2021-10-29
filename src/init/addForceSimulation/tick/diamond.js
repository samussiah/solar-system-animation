export default function diamond(d) {
    const ctx = this.layout.canvas.context;

    const halfWidth = d.value.size * Math.sqrt(2);

    ctx.moveTo(d.x, d.y - halfWidth);
    ctx.lineTo(d.x + halfWidth, d.y);
    ctx.lineTo(d.x, d.y + halfWidth);
    ctx.lineTo(d.x - halfWidth, d.y);
    ctx.lineTo(d.x, d.y - halfWidth);

    if (this.settings.fill) {
        this.layout.canvas.context.fillStyle = d.value.fill;
        this.layout.canvas.context.fill();
    }

    this.layout.canvas.context.strokeStyle = d.value.stroke;
    this.layout.canvas.context.stroke();
}
