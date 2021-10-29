export default function timing() {
    return {
        playPause: 'play',
        delay: 5000,
        speed: 'medium',
        speeds: {
            slow: Math.pow(2, 10),
            medium: Math.pow(2, 8),
            fast: Math.pow(2, 6),
        },
        speedChange: null,
        timepoint: 0, // initial timepoint
        timeUnit: 'day', // time unit that appears in labels
        timeRelative: null, // e.g. "from baseline"
        duration: null, // defined in ./defineMetadata/updateIdDependentSettings
        loop: true,
        resetDelay: 15000,
    };
}
