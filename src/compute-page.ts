import {Route} from "./reducer";
import {findMatchingRoutes} from "./helpers/find-matching-routes";

export const computePage: (currentRoute: Route, defaultPage: string, isRouteActive: boolean, route: string) => string = (currentRoute, defaultPage, isRouteActive, route) => {
    let page = undefined;
    if(isRouteActive && currentRoute){
        let matching = findMatchingRoutes(currentRoute.href, [{route: route + '/*'}]);
        if(matching.length){
            let segments = route.split('/').length;
            page = matching[0].match[0].split('/')[segments];
        }
        if(typeof page === 'undefined')
            page = defaultPage;
    }
    return page;
};