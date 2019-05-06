import {Route} from "./reducer";
import {findMatchingRoutes} from "./helpers/find-matching-routes";

export const isRouteActive = (currentRoute: Route, testRoute: string) =>
    currentRoute && typeof testRoute === "string" ? findMatchingRoutes(currentRoute.href, [{route: testRoute}], true).length > 0 : false;