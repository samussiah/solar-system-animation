import color from './settings/color';
import colorScale from './settings/colorScale';

const settings = {
    speed: 'slow',
    speeds: {
        slow: 1000,
        medium: 200,
        fast: 50,
    },
    centerEventType: 'Home',
    centerCoordinates: {
        x: 380,
        y: 365,
    },
    timepoint: 0,
    timeFrame: null,
    width: 780,
    height: 800,
    padding: 1,
    maxRadius: 3,
    color,
    colorScale,
    eventTypes: null, // data-driven by default
    annotations: [
        {
            start_minute: 1,
            stop_minute: 75,
            note:
                'Heart disease is the leading cause of death for men, women, and people of most racial and ethnic groups in the United States.',
        },
        {
            start_minute: 90,
            stop_minute: 165,
            note:
                'One person dies every 37 seconds in the United States from cardiovascular disease.',
        },
        {
            start_minute: 180,
            stop_minute: 255,
            note:
                'About 647,000 Americans die from heart disease each year—that’s 1 in every 4 deaths.',
        },
        {
            start_minute: 270,
            stop_minute: 345,
            note:
                'Heart disease costs the United States about $219 billion each year from 2014 to 2015.',
        },
        {
            start_minute: 360,
            stop_minute: 435,
            note:
                'This includes the cost of health care services, medicines, and lost productivity due to death.',
        },
        {
            start_minute: 450,
            stop_minute: 525,
            note:
                'Coronary heart disease is the most common type of heart disease, killing 365,914 people in 2017.',
        },
        {
            start_minute: 540,
            stop_minute: 615,
            note: 'About 18.2 million adults age 20 and older have CAD (about 6.7%).',
        },
        {
            start_minute: 630,
            stop_minute: 705,
            note: 'About 2 in 10 deaths from CAD happen in adults less than 65 years old.',
        },
        {
            start_minute: 720,
            stop_minute: 795,
            note: 'In the United States, someone has a heart attack every 40 seconds.',
        },
        {
            start_minute: 810,
            stop_minute: 885,
            note: 'Every year, about 805,000 Americans have a heart attack.',
        },
        { start_minute: 900, stop_minute: 975, note: '75% experience their first heart attack' },
        { start_minute: 990, stop_minute: 1065, note: '25% have already had a heart attack.' },
        {
            start_minute: 1080,
            stop_minute: 1155,
            note:
                'About 1 in 5 heart attacks is silent—the damage is done, but the person is not aware of it.',
        },
    ],
};

export default settings;
