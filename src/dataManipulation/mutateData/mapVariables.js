export default function mapVariables() {
    this.data.forEach((d) => {
        for (const setting of Object.keys(this.settings).filter((key) => /_var$/.test(key))) {
            const variable = setting.replace(/_var$/, '');
            d[variable] = [
                'event_order',
                'start_timepoint',
                'end_timepoint',
                'duration',
                'sequence',
            ].includes(variable)
                ? +d[this.settings[setting]]
                : d[this.settings[setting]];
        }
    });
}
