export default function square(d) {
    this.layout.canvas.context.rect(
        d.x - d.value.size,
        d.y - d.value.size,
        d.value.size * 2,
        d.value.size * 2
    );
    if (this.settings.fill) {
        this.layout.canvas.context.fillStyle = d.value.fill;
        this.layout.canvas.context.fill();
    }
    this.layout.canvas.context.strokeStyle = d.value.stroke;
    this.layout.canvas.context.stroke();
}
