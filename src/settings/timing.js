export default function timing() {
    return {
        playPause: 'play',
        delay: 5000,
        speed: 'medium',
        speeds: {
            slow: 1000,
            medium: 500,
            fast: 100,
        },
        timepoint: 0, // initial timepoint
        timeUnit: 'day', // time unit that appears in labels
        timeRelative: null, // e.g. "from baseline"
        duration: null, // defined in ./defineMetadata/updateIdDependentSettings
        loop: true,
        resetDelay: 15000,
    };
}
