fetch('../data/adverse-event-outcome.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        data.forEach(d => {
        });

        // TODO: figure out why bubbles ares moving from the fourth ring to the third ring
        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                eventLabel: 'Adverse Events',
                timeRelative: 'since onset',
                orbitLabels: [
                    'Severity',
                    'Treatment',
                    'Outcome',
                    'Efficacy Endpoint' ,
                ],
                sequences: [
                    {
                        label: 'Severity to Treatment',
                        timeRelative: 'since onset',
                        start_order: 1,
                        end_order: 2,
                        //duration: 28,
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
                        //duration: 28,
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
                        //duration: 28,
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
                },
                sizeBy: {
                    type: null,
                },
                shapeBy: {
                    type: 'categorical',
                    variable: 'shape',
                    label: 'Treatment',
                },
                freqTable: {
                    display: false,
                },
                speed: 'fast',
                delay: false,
                modalSpeed: 1000,
                explanation: null,
                runSequences: true,
                eventCountType: 'cumulative-id',
            }
        );
    });
