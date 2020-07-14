// Minutes to time of day. Data is minutes from 4am.
export default function minutesToTime(m) {
    var minutes = m % 1440;
    //var minutes = (m + 4 * 60) % 1440;
    var hh = Math.floor(minutes / 60);
    var ampm;
    if (hh > 12) {
        hh = hh - 12;
        ampm = 'pm';
    } else if (hh == 12) {
        ampm = 'pm';
    } else if (hh == 0) {
        hh = 12;
        ampm = 'am';
    } else {
        ampm = 'am';
    }
    var mm = minutes % 60;
    if (mm < 10) {
        mm = '0' + mm;
    }

    return `${minutes} ${this.settings.timeUnit}`;
    //return hh + ":" + mm + ampm
}
