fetch('../data/adverse-event-outcome.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        data.forEach(d => {
        });

        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                individualUnit: 'adverse event',
                individualLabel: 'Adverse Events <sup><small>1</small></sup>',
                timeRelative: 'since onset',
                orbitLabels: [
                    'Severity',
                    'Treatment',
                    'Outcome',
                    'Efficacy Endpoint' ,
                ],
                colorBy: {
                    type: 'categorical',
                    variable: 'color',
                    label: 'Severity',
                    colorScheme: 'Tableau10',
                    stratify: false,
                    order: [
                        'Mild',
                        'Moderate',
                        'Severe',
                        'Onset',
                    ],
                },
                sizeBy: {
                    type: null,
                },
                shapeBy: {
                    type: 'categorical',
                    variable: 'shape',
                    label: 'Treatment',
                    order: [
                        'Not Treated',
                        'Standard of Care',
                        'Rescue Meds',
                    ],
                },
                freqTable: {
                    display: false,
                },
                annotations: [
                    {
                        label: '↑',
                        orbit: 4,
                        angle: -.5,
                        dx: '-20px',
                    },
                    {
                        label: '↓',
                        orbit: 4,
                        angle: .5,
                        dx: '-20px',
                    },
                ],
                speeds: {
                    fast: 25,
                },
                speed: 'fast',
                //delay: false,
                modalSpeed: 1000,
                modalPosition: 'bottom-left',
                eventCountType: 'cumulative-id',
                collisionPadding: 3,
                focusOffset: 'none',
                stateChange: 'ordered',
            }
        );
    });
