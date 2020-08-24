export default function tick() {
    this.context.clearRect(0, 0, this.settings.width, this.settings.height);
    this.context.save();
    //this.context.translate(this.settings.width/2,this.settings.height/2);
    this.context.translate(-(this.settings.width / 2 - 100), -(this.settings.height / 2 - 100));

    this.data.nested
        .sort((a, b) => a.value.stateChanges - b.value.stateChanges) // draw bubbles with more state changes last
        .forEach((d, i) => {
            this.context.beginPath();
            //this.context.moveTo(d.x + d.r, d.y);
            this.context.arc(d.x, d.y, d.value.r, 0, 2 * Math.PI);
            //this.context.fillStyle = d.value.fill;
            //this.context.fill();
            this.context.strokeStyle = d.value.stroke;
            this.context.stroke();
        });

    this.context.restore();
}
