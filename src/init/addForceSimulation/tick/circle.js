export default function circle(d) {
    this.containers.canvas.context.moveTo(d.x + d.size, d.y);
    this.containers.canvas.context.arc(d.x, d.y, d.value.size, 0, 2 * Math.PI);
    if (this.settings.fill) {
        this.containers.canvas.context.fillStyle = d.value.fill;
        this.containers.canvas.context.fill();
    }
    this.containers.canvas.context.strokeStyle = d.value.stroke;
    this.containers.canvas.context.stroke();
}
