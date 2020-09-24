export default function tick(event) {
    this.containers.canvas.context.clearRect(0, 0, this.settings.width, this.settings.height);
    this.containers.canvas.context.save();

    this.data.nested
        .sort((a, b) => a.value.stateChanges - b.value.stateChanges) // draw bubbles with more state changes last
        .forEach((d, i) => {
            this.containers.canvas.context.beginPath();

            // circle
            if (this.settings.shape === 'circle') {
                this.containers.canvas.context.moveTo(d.x + d.r, d.y);
                this.containers.canvas.context.arc(d.x, d.y, d.value.r, 0, 2 * Math.PI);
                if (this.settings.fill) {
                    this.containers.canvas.context.fillStyle = d.value.fill;
                    this.containers.canvas.context.fill();
                }
                this.containers.canvas.context.strokeStyle = d.value.stroke;
                this.containers.canvas.context.stroke();
            }
            // square
            else {
                //this.containers.canvas.context.moveTo(d.x + d.r, d.y);
                this.containers.canvas.context.rect(
                    d.x - d.value.r,
                    d.y - d.value.r,
                    d.value.r * 2,
                    d.value.r * 2
                );
                if (this.settings.fill) {
                    this.containers.canvas.context.fillStyle = d.value.fill;
                    this.containers.canvas.context.fill();
                }
                this.containers.canvas.context.strokeStyle = d.value.stroke;
                this.containers.canvas.context.stroke();
            }
        });

    this.containers.canvas.context.restore();
}
