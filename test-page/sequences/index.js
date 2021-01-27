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
                sequences: [
                    {
                        label: 'Onset to Treatment',
                        timeRelative: 'since onset',
                        start_order: 1,
                        end_order: 2,
                        //duration: 10,
                        information: [
                            'Event onset by severity',
                            'Event treatment',
                        ],
                    },
                    {
                        label: 'Treatment to Outcome',
                        timeRelative: 'since beginning of treatment',
                        start_order: 2, 
                        end_order: 3,
                        //duration: 14,
                        information: [
                            'Event treatment',
                            'Event outcome',
                        ],
                    },
                    {
                        label: 'Outcome to Efficacy Endpoint',
                        timeRelative: 'since outcome',
                        start_order: 3, 
                        end_order: 4,
                        //duration: 14,
                        information: [
                            'Event outcome',
                            'Efficacy endpoint',
                        ],
                    },
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
                        'Pre-onset',
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
                speed: 'medium',
                delay: false,
                modalSpeed: 3000,
                explanation: null,
                runSequences: true,
                eventCountType: 'cumulative-id',
            }
        );
    });
