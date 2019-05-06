const PARAMETER_REGEXP = /([:*])(\w+)/g;
const WILDCARD_REGEXP = /\*/g;
const REPLACE_VARIABLE_REGEXP = '([^\/]+)';
const REPLACE_WILDCARD = '(?:.*)';
const FOLLOWED_BY_SLASH_REGEXP = '(?:\/$|$)';
const MATCH_REGEXP_FLAGS = '';
export function replaceDynamicURLParts(route) {
    let paramNames = [], regexp;

    if (route instanceof RegExp) {
        regexp = route;
    } else {
        regexp = new RegExp(
            route.replace(PARAMETER_REGEXP, function (full, dots, name) {
                paramNames.push(name);
                return REPLACE_VARIABLE_REGEXP;
            })
                .replace(WILDCARD_REGEXP, REPLACE_WILDCARD) + FOLLOWED_BY_SLASH_REGEXP
            , MATCH_REGEXP_FLAGS);
    }
    return { regexp, paramNames };
}
