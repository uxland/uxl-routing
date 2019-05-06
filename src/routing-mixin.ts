import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin';
import {Constructor, property} from "lit-element/lib/decorators";
import {Route} from "./reducer";
import {RoutingSelectors} from "./selectors";
import {LitElement, notEqual, PropertyValues} from 'lit-element/lit-element';
import {isRouteActive} from "./is-route-active";
import {propertiesObserver} from "@uxland/uxl-utilities/es/properties-observer";

import {MixinFunction} from "@uxland/uxl-utilities";
import {ConnectMixin, ConnectMixinConstructor, ConnectMixinFunction} from "@uxland/lit-redux-connect";
import {watch} from "@uxland/lit-redux-connect/es/watch";
export interface RoutingMixin<TParams = any>{
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
export interface RoutingMixinConstructor<TParams = any> extends ConnectMixinConstructor{
    new(...args: any[]):RoutingMixin<TParams> & ConnectMixin & LitElement;
}

export type RoutingMixinFunction<TParams = any > = MixinFunction<RoutingMixinConstructor<TParams>>;

export const routingMixin: <TParams = any>(connectMixin: ConnectMixinFunction, selectors: RoutingSelectors) => RoutingMixinFunction<TParams> = <TParams>(connectMixin, selectors) =>
    dedupingMixin((superClass: Constructor<LitElement>) =>{
        class RoutingMixin extends connectMixin(propertiesObserver(superClass)) implements RoutingMixin{
            @property()
            subroute: string;
            @watch(selectors.routeSelector)
            route: Route;
            @watch(selectors.currentParamsSelector)
            params: TParams;
            @watch(selectors.currentQuerySelector)
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
        return <any>RoutingMixin;
    });
