export default function draw() {
    const main = this;

    this.worker.onmessage = function (event) {
        main.containers.canvas.context.clearRect(0, 0, main.settings.width, main.settings.height);
        main.containers.canvas.context.save();

        event.data
            .sort((a, b) => a.value.stateChanges - b.value.stateChanges) // draw bubbles with more state changes last
            .forEach((d, i) => {
                main.containers.canvas.context.beginPath();

                // circle
                //if (main.settings.shape === 'circle') {
                //if (i % 2) {
                main.containers.canvas.context.moveTo(d.x + d.r, d.y);
                main.containers.canvas.context.arc(d.x, d.y, d.value.r, 0, 2 * Math.PI);
                if (main.settings.fill) {
                    main.containers.canvas.context.fillStyle = d.value.fill;
                    main.containers.canvas.context.fill();
                }
                main.containers.canvas.context.strokeStyle = d.value.stroke;
                main.containers.canvas.context.stroke();
                //}
                // square
                //else {
                //    //main.containers.canvas.context.moveTo(d.x + d.r, d.y);
                //    main.containers.canvas.context.rect(
                //        d.x - d.value.r,
                //        d.y - d.value.r,
                //        d.value.r * 2,
                //        d.value.r * 2
                //    );
                //    if (main.settings.fill) {
                //        main.containers.canvas.context.fillStyle = d.value.fill;
                //        main.containers.canvas.context.fill();
                //    }
                //    main.containers.canvas.context.strokeStyle = d.value.stroke;
                //    main.containers.canvas.context.stroke();
                //}
            });

        main.containers.canvas.context.restore();
    };
}
