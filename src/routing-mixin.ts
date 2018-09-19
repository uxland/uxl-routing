import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin';
import {property} from "@uxland/uxl-polymer2-ts";
import {Route} from "./reducer";
import {ReduxMixin} from "@uxland/uxl-redux/redux-mixin";
import {RoutingSelectors} from "./selectors";
import {LitElement, notEqual, PropertyValues} from '@polymer/lit-element/lit-element';
import {isRouteActive} from "./is-route-active";
import {propertiesObserver} from "@uxland/uxl-utilities/properties-observer";
export interface IRoutingMixinBase<TParams = any> extends LitElement{
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
export interface IRoutingMixin<T = LitElement, Params=any> extends IRoutingMixinBase<Params>, LitElement{
    new(): IRoutingMixin<T, Params> & T & LitElement;
}

export const routingMixin: <T, Params>(reduxMixin: ReduxMixin, selectors: RoutingSelectors) => (parent: any) => IRoutingMixin<T, Params> = <T, Params>(reduxMixin, selectors) => dedupingMixin((p: LitElement) =>{
    class RoutingMixin extends reduxMixin(propertiesObserver(p)){
        @property()
        subroute: string;
        @property({statePath: selectors.routeSelector})
        route: Route;
        @property({statePath: selectors.currentParamsSelector})
        params: Params;
        @property({statePath: selectors.currentQuerySelector})
        query: string;
        @property()
        isRouteActive: boolean = false;
        update(changedProperties: PropertyValues){
            let active = isRouteActive(this.route, this.subroute);
            if(notEqual(active, this.isRouteActive)){
                let previous = this.isRouteActive;
                this.isRouteActive = active;
                this.isRouteActiveChanged(this.isRouteActive, previous);
            }
            super.update(changedProperties);
        }

        routeChanged(current: Route, previous: Route){

        }
        isRouteActiveChanged(current: boolean, previous: boolean): void {
        }

        paramsChanged(current: Object, previous: object){

        }

        queryChanged(current: string, previous: string){

        }

    }
    return (<any>RoutingMixin) as IRoutingMixin<T, Params>;
});
