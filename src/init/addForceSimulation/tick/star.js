export default function star(d) {
    const ctx = this.layout.canvas.context;

    const spikes = 5;
    const step = Math.PI / spikes;
    const innerRadius = d.value.size * 0.75;
    const outerRadius = d.value.size * 1.5;

    let rot = (Math.PI / 2) * 3;
    let x = d.x;
    let y = d.y;

    ctx.beginPath();
    ctx.moveTo(d.x, d.y - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = d.x + Math.cos(rot) * outerRadius;
        y = d.y + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = d.x + Math.cos(rot) * innerRadius;
        y = d.y + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(d.x, d.y - outerRadius);
    ctx.closePath();
    //ctx.lineWidth = 5;
    ctx.strokeStyle = d.value.stroke;
    ctx.stroke();
    ctx.fillStyle = d.value.fill;
    ctx.fill();
}
