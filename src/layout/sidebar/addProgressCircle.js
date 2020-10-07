import ProgressBar from 'progressbar.js';

export default function addProgressCircle(progress) {
    return new ProgressBar.Circle(progress.node(), {
        trailColor: '#ccc',
        trailWidth: 5,
        easing: 'easeInOut',
        duration: 1,
        text: {
            autoStyleContainer: false,
        },
        from: {
            color: '#66bd63',
            width: 5,
        },
        to: {
            color: '#006837',
            width: 5,
        },
        step: function (state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            circle.setText(
                `${
                    circle.value() < 0.0095
                        ? d3.format('.1%')(circle.value())
                        : d3.format('.0%')(circle.value())
                } complete`
            );
        },
    });
}
