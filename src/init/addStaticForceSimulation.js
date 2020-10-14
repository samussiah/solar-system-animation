import radial from './addStaticForceSimulation/radial';
import circular from './addStaticForceSimulation/circular';

export default function addStaticForceSimulation() {
    if (this.settings.drawStaticSeparately) {
        const noStateChange = this.data.nested
            .filter((d) => d.value.noStateChange)
            .map((d) => {
                return {
                    key: d.key,
                    category: d.value.category,
                };
            });

        let staticForceSimulation;
        if (this.settings.colorBy.type === 'categorical') {
            staticForceSimulation = this.metadata.event[0].foci.map((focus) => {
                const data = noStateChange.filter((d) => d.category === focus.key);
                const forceSimulation =
                    this.settings.staticLayout === 'radial'
                        ? radial.call(this, data, focus.x, focus.y, this.colorScale(focus.key))
                        : circular.call(this, data, focus.x, focus.y, this.colorScale(focus.key));
                return forceSimulation;
            });
        } else {
            staticForceSimulation =
                this.settings.staticLayout === 'radial'
                    ? [
                          radial.call(
                              this,
                              noStateChange,
                              this.settings.orbitRadius / 2,
                              this.settings.height / 2,
                              this.settings.color(0)
                          ),
                      ]
                    : [
                          circular.call(
                              this,
                              noStateChange,
                              this.settings.orbitRadius / 2,
                              this.settings.height / 2,
                              this.settings.color(0)
                          ),
                      ];
        }

        return staticForceSimulation;
    }
}
