fetch('./data_1000.csv')
//fetch('./data_2000_fixed.csv')
    .then(response => response.text())
    .then(text => d3.csvParse(text))
    .then(data => {
        // Remove events after first instance of death.
        const nest = d3.nest()
            .key(d => d.id)
            .rollup(nest => {
                for (const d of nest) {
                    if (d.event === 'Death') {
                        nest.filter(di => +di.seq > +d.seq)
                            .forEach(di => {
                                data.splice(data.findIndex(dii => dii === di), 1);
                            });
                        break;
                    }
                }
            })
            .entries(data);

        data.forEach((d,i) => {
            if (d.event === 'Death')
                d.event = Math.random() < .75 ? 'Death (CV-related)' : 'Death (other)';
        });

        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                eventChangeCount: ['Hospitalization', 'ICU'],
                eventChangeCountAesthetic: 'both',
                nFoci: 16,
                //hideControls: true,
                //playPause: 'play',
                //speed: 'fast',
                //duration: 5,
                notes: [
                    {
                        startTimepoint: 40,
                        stopTimepoint: 75,
                        text:
                            'Heart disease is the leading cause of death for men, women, and people of most racial and ethnic groups in the United States.',
                    },
                    {
                        startTimepoint: 90,
                        stopTimepoint: 165,
                        text:
                            'One person dies every 37 seconds in the United States from cardiovascular disease.',
                    },
                    {
                        startTimepoint: 180,
                        stopTimepoint: 255,
                        text:
                            'About 647,000 Americans die from heart disease each year—that’s 1 in every 4 deaths.',
                    },
                    {
                        startTimepoint: 270,
                        stopTimepoint: 345,
                        text:
                            'Heart disease costs the United States about $219 billion each year from 2014 to 2015.',
                    },
                    {
                        startTimepoint: 360,
                        stopTimepoint: 435,
                        text:
                            'This includes the cost of health care services, medicines, and lost productivity due to death.',
                    },
                    {
                        startTimepoint: 450,
                        stopTimepoint: 525,
                        text:
                            'Coronary heart disease is the most common type of heart disease, killing 365,914 people in 2017.',
                    },
                    {
                        startTimepoint: 540,
                        stopTimepoint: 615,
                        text: 'About 18.2 million adults age 20 and older have CAD (about 6.7%).',
                    },
                    {
                        startTimepoint: 630,
                        stopTimepoint: 705,
                        text: 'About 2 in 10 deaths from CAD happen in adults less than 65 years old.',
                    },
                    {
                        startTimepoint: 720,
                        stopTimepoint: 795,
                        text: 'In the United States, someone has a heart attack every 40 seconds.',
                    },
                    {
                        startTimepoint: 810,
                        stopTimepoint: 885,
                        text: 'Every year, about 805,000 Americans have a heart attack.',
                    },
                    {
                        startTimepoint: 900,
                        stopTimepoint: 975,
                        text: '75% experience their first heart attack',
                    },
                    { startTimepoint: 990, stopTimepoint: 1065, text: '25% have already had a heart attack.' },
                    {
                        startTimepoint: 1080,
                        stopTimepoint: 1155,
                        text:
                            'About 1 in 5 heart attacks is silent—the damage is done, but the person is not aware of it.',
                    },
                ],
            }
        );
    });
