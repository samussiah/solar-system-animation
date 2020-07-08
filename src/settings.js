import foci from './settings/foci';
import eventCounts from './settings/eventCounts';
import color from './settings/color';

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
    width: 780,
    height: 800,
    padding: 1,
    maxRadius: 3,
    color,
    eventTypes: [
        { index: '0', short: 'Home', desc: 'Home' },
        { index: '1', short: 'Hosp.', desc: 'Hospitalization' },
        { index: '2', short: 'ICU', desc: 'Intensive Care Unit' },
        { index: '3', short: 'Death', desc: 'Death' },

        //{'index': '0', 'short': 'Sleeping', 'desc': 'Sleeping'},
        //{'index': '1', 'short': 'Personal Care', 'desc': 'Personal Care'},
        //{'index': '2', 'short': 'Eating & Drinking', 'desc': 'Eating and Drinking'},
        //{'index': '3', 'short': 'Education', 'desc': 'Education'},
        //{'index': '4', 'short': 'Work', 'desc': 'Work and Work-Related Activities'},
        //{'index': '5', 'short': 'Housework', 'desc': 'Household Activities'},
        //{'index': '6', 'short': 'Household Care', 'desc': 'Caring for and Helping Household Members'},
        //{'index': '7', 'short': 'Non-Household Care', 'desc': 'Caring for and Helping Non-Household Members'},
        //{'index': '8', 'short': 'Shopping', 'desc': 'Consumer Purchases'},
        //{'index': '9', 'short': 'Pro. Care Services', 'desc': 'Professional and Personal Care Services'},
        //{'index': '10', 'short': 'Leisure', 'desc': 'Socializing, Relaxing, and Leisure'},
        //{'index': '11', 'short': 'Sports', 'desc': 'Sports, Exercise, and Recreation'},
        //{'index': '12', 'short': 'Religion', 'desc': 'Religious and Spiritual Activities'},
        //{'index': '13', 'short': 'Volunteering', 'desc': 'Volunteer Activities'},
        //{'index': '14', 'short': 'Phone Calls', 'desc': 'Telephone Calls'},
        //{'index': '15', 'short': 'Misc.', 'desc': 'Other'},
        //{'index': '16', 'short': 'Traveling', 'desc': 'Traveling'},
    ],
    annotations: [
        {
            start_minute: 1,
            stop_minute: 40,
            note: 'The simulation kicks in, based on data from the American Time Use Survey.',
        },
        {
            start_minute: 70,
            stop_minute: 120,
            note:
                'Most people are still sleeping this early in the morning, but some are already at work or preparing for the day.',
        },
        {
            start_minute: 180,
            stop_minute: 300,
            note:
                "It's wake up time for most. Time to start the day with morning rituals, breakfast and a wonderful commute.",
        },
        {
            start_minute: 360,
            stop_minute: 440,
            note:
                'The day is in full swing with work or housework. Stores and services are open so people can run errands, and they take various forms of transportation to get there.',
        },
        {
            start_minute: 480,
            stop_minute: 540,
            note:
                "Lunch hour. Many go eat, but there's still activity throughout. You see a small shift at the end of the hour.",
        },
        {
            start_minute: 660,
            stop_minute: 720,
            note: 'Coffee break? Again, at the top of the hour, you see a shift in activity.',
        },
        {
            start_minute: 780,
            stop_minute: 830,
            note:
                "With the work day done, it's time to commute home and fix dinner or go out for a while.",
        },
        { start_minute: 870, stop_minute: 890, note: 'Dinner time!' },
        {
            start_minute: 930,
            stop_minute: 1010,
            note: "Dinner's done. Time for relaxation, TV, games, hobbies and socializing.",
        },
        {
            start_minute: 1080,
            stop_minute: 1140,
            note:
                'Winding down for the day. From leisure time, people shift to personal care and sleep.',
        },
        {
            start_minute: 1210,
            stop_minute: 1300,
            note:
                'Goodnight. More than 80% of people are asleep and it peaks at 96% around 3:00am.',
        },
    ],
};

settings.foci = foci(settings);
settings.eventCounts = eventCounts(settings);

export default settings;
