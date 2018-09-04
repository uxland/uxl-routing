import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin';
import {property} from "@uxland/uxl-polymer2-ts";
import {Route} from "./reducer";
import {ReduxMixin} from "@uxland/uxl-redux/redux-mixin";
import {RoutingSelectors} from "./selectors";
import {LitElement} from '@polymer/lit-element/lit-element';
import {isRouteActive} from "./is-route-active";
export interface IRoutingMixinBase<TParams = any>{
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
    class RoutingMixin extends reduxMixin(p){
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
        _flushProperties(){
            let active = isRouteActive(this.route, this.subroute);
            if(active != this.isRouteActive)
                this._setPendingProperty('isRouteActive', active, true);
            super._flushProperties();
        }
        _shouldRender(props: RoutingMixin, changedProps: RoutingMixin, previousProps: RoutingMixin){
            let needToComputeIsRouteActive = changedProps && Object.getOwnPropertyNames(changedProps).some(name => name === 'route' || name === 'subroute');
            changedProps && this.notifyChangedProperties(['isRouteActive', 'route', 'query', 'params'], changedProps, previousProps);
            return true;//this.isRouteActive;
        }

        private notifyChangedProperties(properties: string[], changedProps: any, previousProps: any){
            properties.forEach(p =>{
                if(Object.getOwnPropertyDescriptor(changedProps, p)){
                    let handler = `${p}Changed`;
                    if(this[handler])
                        this[handler](changedProps[p], previousProps[p]);
                }
            })
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
