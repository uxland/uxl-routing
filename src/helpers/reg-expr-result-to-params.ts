export function regExpResultToParams(match: RegExpMatchArray, names: string[]): any {
    if (names.length === 0) return null;
    if (!match) return null;
    return match
        .slice(1, match.length)
        .reduce((params, value, index) => {
            params[names[index]] = decodeURIComponent(value);
            return params;
        }, {});
}
