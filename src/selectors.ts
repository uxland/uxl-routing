import { createSelector } from 'reselect';
import { Route, RoutingState } from './reducer';

export interface AppRoutingState {
  routing: RoutingState;
}
export interface RoutingSelectors {
  routingSelector: (state: any) => RoutingState;
  routeSelector: (state: any) => Route;
  currentParamsSelector: (state: any) => any;
  currentQuerySelector: (state: any) => string;
}
declare type routingSelectorType = (state: AppRoutingState) => RoutingState;
const routeSelectorFactory: (sel: routingSelectorType) => (state: any) => Route = sel =>
  createSelector(
    sel,
    routing => routing.route
  );
const paramsSelectorFactory: (sel: (state: any) => Route) => (state: any) => Object = sel =>
  createSelector(
    sel,
    route => route.params
  );
const querySelectorFactory: (sel: (state: any) => Route) => (state: any) => string = sel =>
  createSelector(
    sel,
    route => route.query
  );

const defaultRoutingSelector = (state: AppRoutingState) => state.routing;

export const routingSelectors: RoutingSelectors = <any>{};
export const setRoutingSelectors: (selector: (state: any) => RoutingState) => void = selector => {
  routingSelectors.routingSelector = selector;
  routingSelectors.routeSelector = routeSelectorFactory(selector);
  routingSelectors.currentParamsSelector = paramsSelectorFactory(routingSelectors.routeSelector);
  routingSelectors.currentQuerySelector = querySelectorFactory(routingSelectors.routeSelector);
};
setRoutingSelectors(defaultRoutingSelector);
