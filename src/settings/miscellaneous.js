export default function miscellaneous() {
    return {
        hideControls: false,
        focusOffset: 'heuristic', // ['heuristic', 'none', 'above', 'below']
        stratificationPositioning: 'circular', // ['circular', 'orbital']
        annotations: null,
        stateChange: 'chronological', // ['chronological', 'ordered']
        stateChangeAnnotation: true,
        displayProgress: true,
        footnotes: [],
        root: {
            'left-margin': '25%',
        },
        orbitShape: 'circle', // ['circle', 'ellipse']
    };
}
