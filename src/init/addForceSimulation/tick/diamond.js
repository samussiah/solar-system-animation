export default function diamond(d) {
    const ctx = this.containers.canvas.context;

    const halfWidth = d.value.size * Math.sqrt(2);

    ctx.moveTo(d.x, d.y - halfWidth);
    ctx.lineTo(d.x + halfWidth, d.y);
    ctx.lineTo(d.x, d.y + halfWidth);
    ctx.lineTo(d.x - halfWidth, d.y);
    ctx.lineTo(d.x, d.y - halfWidth);

    if (this.settings.fill) {
        this.containers.canvas.context.fillStyle = d.value.fill;
        this.containers.canvas.context.fill();
    }

    this.containers.canvas.context.strokeStyle = d.value.stroke;
    this.containers.canvas.context.stroke();
}
