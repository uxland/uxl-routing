export function clean(s) {
    if (s instanceof RegExp) return s;
    return s.replace(/\/+$/, '').replace(/^\/+/, '^/');
}
