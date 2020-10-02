//fetch('./data/data_1000.csv')
//fetch('./data/data_4000.csv')
fetch('./data/data_2000_fixed.csv')
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
                //d.outcome = Math.random();
                //d.category = i%3;
                d.event_position = d.event === 'Home'
                    ? 0
                    : d.event === 'Hospitalization'
                    ? -45
                    : d.event === 'ICU'
                    ? 25
                    : d.event === 'Death (CV-related)'
                    ? -10
                    : d.event === 'Death (other)'
                    ? 10
                    : 0;
        });

        const fdg = forceDirectedGraph(
            data,
            '#container',
            {
                eventChangeCount: ['Hospitalization', 'ICU'],
                eventChangeCountAesthetic: 'both',
                //shape: 'square',
                //hideControls: true,
                //playPause: 'pause',
                //speed: 'medium',
                //duration: 5,
                //resetDelay: 5000,
                information: [
                    'Heart disease is the leading cause of death for men, women, and people of most racial and ethnic groups in the United States.',
                    'One person dies every 37 seconds in the United States from cardiovascular disease.',
                    'About 647,000 Americans die from heart disease each year—that’s 1 in every 4 deaths.',
                    'Heart disease costs the United States about $219 billion each year from 2014 to 2015.',
                    'This includes the cost of health care services, medicines, and lost productivity due to death.',
                    'Coronary heart disease is the most common type of heart disease, killing 365,914 people in 2017.',
                    'About 18.2 million adults age 20 and older have CAD (about 6.7%).',
                    'About 2 in 10 deaths from CAD happen in adults less than 65 years old.',
                    'In the United States, someone has a heart attack every 40 seconds.',
                    'Every year, about 805,000 Americans have a heart attack.',
                    '75% experience their first heart attack',
                    '25% have already had a heart attack.',
                    'About 1 in 5 heart attacks is silent—the damage is done, but the person is not aware of it.',
                ],
            }
        );
    });
