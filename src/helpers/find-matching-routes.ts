import {replaceDynamicURLParts} from "./replace-dynamic-parts";
import {clean} from "./clean";
import {regExpResultToParams} from "./reg-expr-result-to-params";
import isNil from "ramda/es/isNil";

export interface MatchingRoute<T = any> {
    match: RegExpMatchArray;
    route: T;
    params: any;
}

export const findMatchingRoutes: <T extends {route: string}>(url: string, routes: T[], includeSubRoutes?: boolean, addWildCard?: boolean) => MatchingRoute<T>[] = (url, routes, includeSubRoutes, addWildCard) => {
    let result = isNil(url) ? [] : routes.map(route => {
        let {regexp, paramNames} = replaceDynamicURLParts(clean(addWildCard ? route.route + '/*' : route.route));
        let match = url.replace(/^\/+/, '/').match(regexp);
        let params = regExpResultToParams(match, paramNames);
        return match ? {match, route, params} : null
    }).filter(m => m !== null);
    result = includeSubRoutes ? [...result, ...findMatchingRoutes(url, routes, false, true)] : result;
    return result.sort((a, b) =>{
        if(a === null)
            return 1;
        if(b === null)
            return -1;
        let aSegments = a.route.route.split('/');
        let bSegments = b.route.route.split('/');
        return bSegments.length - aSegments.length;
    })
};
