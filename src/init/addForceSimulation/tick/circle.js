export default function circle(d) {
    this.layout.canvas.context.moveTo(d.x + d.size, d.y);
    this.layout.canvas.context.arc(d.x, d.y, d.value.size, 0, 2 * Math.PI);
    if (this.settings.fill) {
        this.layout.canvas.context.fillStyle = d.value.fill;
        this.layout.canvas.context.fill();
    }
    this.layout.canvas.context.strokeStyle = d.value.stroke;
    this.layout.canvas.context.stroke();
}
