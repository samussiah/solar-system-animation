// Output readable percent based on count.
export default function readablePercent(n) {
    var pct = 100 * n / 1000;
    if (pct < 1 && pct > 0) {
        pct = "<1%";
    } else {
        pct = Math.round(pct) + "%";
    }
    
    return pct;
}