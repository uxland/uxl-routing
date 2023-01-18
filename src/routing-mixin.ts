import {connect, ConnectMixin, ConnectMixinConstructor} from '@uxland/lit-redux-connect';
import {watch} from '@uxland/lit-redux-connect/es/watch';
import {dedupingMixin, MixinFunction} from '@uxland/uxl-utilities';
import {property} from 'lit/decorators';
import {LitElement, notEqual, PropertyValues} from 'lit';
import {Store} from 'redux';
import {isRouteActive} from './is-route-active';
import {Route} from './reducer';
import {RoutingSelectors} from './selectors';

export interface RoutingMixin<TParams = any> {
  isRouteActive: boolean;
  route: Route;
  params: TParams;
  query: string;
  subroute: string;
  isRouteActiveChanged(current: boolean, previous: boolean): any;
  paramsChanged(current: Object, previous: Object): any;
  queryChanged(current: string, previous: string);
  routeChanged(current: Route, previous: Route): any;
}
export interface RoutingMixinConstructor<TParams = any>
  extends ConnectMixinConstructor,
    RoutingMixin<TParams> {
  new (...args: any[]): RoutingMixin<TParams> & ConnectMixin & LitElement;
}

export type RoutingMixinFunction<TParams = any> = MixinFunction<RoutingMixinConstructor<TParams>>;

export const routingMixin: <TParams>(
  store: Store<any, any>,
  selectors: RoutingSelectors
) => RoutingMixinFunction = <TParams>(store, selectors) =>
  dedupingMixin((superClass: ConnectMixinConstructor) => {
    const watchOptions = {store};
    class RoutingMixinClass extends connect(store)(superClass) implements RoutingMixin<TParams> {
      @property()
      subroute: string;
      @watch(selectors.routeSelector, watchOptions)
      route: Route;
      @watch(selectors.currentParamsSelector, watchOptions)
      params: TParams;
      @watch(selectors.currentQuerySelector, watchOptions)
      query: string;
      @property()
      isRouteActive: boolean = false;

      update(changedProps: PropertyValues) {
        let active = isRouteActive(this.route, this.subroute);
        if (notEqual(active, this.isRouteActive)) {
          let previous = this.isRouteActive;
          this.isRouteActive = active;
          this.isRouteActiveChanged(this.isRouteActive, previous);
        }
        return super.update(changedProps);
      }

      routeChanged(current: Route, previous: Route) {}
      isRouteActiveChanged(current: boolean, previous: boolean): void {}
      paramsChanged(current: Object, previous: object) {}
      queryChanged(current: string, previous: string) {}
    }
    return <any>RoutingMixinClass;
  });
