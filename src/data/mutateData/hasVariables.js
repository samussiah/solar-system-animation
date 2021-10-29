export default function hasVariables() {
    const has = {};

    for (const setting of Object.keys(this.settings).filter((key) => /_var$/.test(key))) {
        const variable = setting.replace(/_var$/, '');
        has[variable] = this.data[0].hasOwnProperty(this.settings[setting]);
    }

    return has;
}
