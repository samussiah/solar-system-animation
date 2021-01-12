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
                sequences: [
                    {
                        // sequence start
                        start_event: [
                            'Mild',
                            'Moderate',
                            'Severe',
                        ], // or
                        start_order: 1, // or

                        // sequence end
                        end_event: [
                            'Standard of Care',
                            'Rescues Meds',
                        ], // or
                        end_order: 2,

                        duration: 28,
                        information: [
                            'Event onset by severity',
                            'Event treatment',
                        ],
                    },
                    {
                        // sequence start
                        start_event: [
                            'Standard of Care',
                            'Rescue Meds',
                        ], // or
                        start_order: 2, // or

                        // sequence end
                        end_event: [
                            'Resolved',
                            'Resolved w/ Sequelae',
                            'Not Resolved',
                        ], // or
                        end_order: 3,

                        duration: 28,
                        information: [
                            'Event treatment',
                            'Event outcome',
                        ],
                    },
                    {
                        // sequence start
                        start_event: [
                            'Resolved',
                            'Resolved w/ Sequelae',
                            'Not Resolved',
                        ], // or
                        start_order: 3, // or

                        // sequence end
                        end_event: [
                            'Major Gain',
                            'Minor Gain',
                            'Minor Loss',
                            'Major Loss',
                        ], // or
                        end_order: 4,

                        duration: 28,
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
                },
                speed: 'slow',
                delay: false,
                modalSpeed: 5000,
                explanation: null,
            }
        );
    });
