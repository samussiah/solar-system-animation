export default function tick() {
    this.containers.canvas.context.clearRect(0, 0, this.settings.width, this.settings.height);
    this.containers.canvas.context.save();
    //this.context.translate(this.settings.width/2,this.settings.height/2);
    if (this.settings.translate)
        this.containers.canvas.context.translate(
            -(this.settings.width / 2 - 100),
            -(this.settings.height / 2 - 100)
        );

    this.data.nested
        .sort((a, b) => a.value.stateChanges - b.value.stateChanges) // draw bubbles with more state changes last
        .forEach((d, i) => {
            this.containers.canvas.context.beginPath();
            //this.context.moveTo(d.x + d.r, d.y);
            this.containers.canvas.context.arc(d.x, d.y, d.value.r, 0, 2 * Math.PI);
            if (this.settings.fill) {
                this.containers.canvas.context.fillStyle = d.value.fill;
                this.containers.canvas.context.fill();
            }
            this.containers.canvas.context.strokeStyle = d.value.stroke;
            this.containers.canvas.context.stroke();
        });

    this.containers.canvas.context.restore();
}
