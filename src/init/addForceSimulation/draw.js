export default function draw() {
    const main = this;

    this.worker.onmessage = function (event) {
        main.layout.canvas.context.clearRect(0, 0, main.settings.width, main.settings.height);
        main.layout.canvas.context.save();

        event.data
            .sort((a, b) => a.value.stateChanges - b.value.stateChanges) // draw bubbles with more state changes last
            .forEach((d, i) => {
                main.layout.canvas.context.beginPath();

                // circle
                //if (main.settings.shape === 'circle') {
                //if (i % 2) {
                main.layout.canvas.context.moveTo(d.x + d.r, d.y);
                main.layout.canvas.context.arc(d.x, d.y, d.value.r, 0, 2 * Math.PI);
                if (main.settings.fill) {
                    main.layout.canvas.context.fillStyle = d.value.fill;
                    main.layout.canvas.context.fill();
                }
                main.layout.canvas.context.strokeStyle = d.value.stroke;
                main.layout.canvas.context.stroke();
                //}
                // square
                //else {
                //    //main.layout.canvas.context.moveTo(d.x + d.r, d.y);
                //    main.layout.canvas.context.rect(
                //        d.x - d.value.r,
                //        d.y - d.value.r,
                //        d.value.r * 2,
                //        d.value.r * 2
                //    );
                //    if (main.settings.fill) {
                //        main.layout.canvas.context.fillStyle = d.value.fill;
                //        main.layout.canvas.context.fill();
                //    }
                //    main.layout.canvas.context.strokeStyle = d.value.stroke;
                //    main.layout.canvas.context.stroke();
                //}
            });

        main.layout.canvas.context.restore();
    };
}
