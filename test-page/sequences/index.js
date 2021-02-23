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
                annotations,
                //speeds: {
                //    fast: 25,
                //},
                speed: 'fast',
                delay: false,
                //playPause: 'pause',
                modalSpeed: 2500,
                modalPosition: 'bottom-right',
                eventCountType: 'cumulative-id',
                collisionPadding: 3,
                focusOffset: 'none',
                stateChange: 'ordered',
                footnotes: [
                    '<sup>1</sup> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    '<sup>2</sup> Proin sagittis nisl rhoncus mattis rhoncus urna neque viverra.',
                    '<sup>3</sup> Quam id leo in vitae.',
                ],
                root: {
                    'left-margin': '17%',
                }
            }
        );
    });
