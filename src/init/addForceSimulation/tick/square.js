export default function square(d) {
    this.containers.canvas.context.rect(
        d.x - d.value.size,
        d.y - d.value.size,
        d.value.size * 2,
        d.value.size * 2
    );
    if (this.settings.fill) {
        this.containers.canvas.context.fillStyle = d.value.fill;
        this.containers.canvas.context.fill();
    }
    this.containers.canvas.context.strokeStyle = d.value.stroke;
    this.containers.canvas.context.stroke();
}
