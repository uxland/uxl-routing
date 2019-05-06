import '@polymer/iron-pages';
import {property, customElement} from "lit-element/lib/decorators";
import {reducer, Route, Router} from './src';
import * as redux from 'redux';
import initializeLinkClickSupport from "./src/link-click-support";
import {LitElement, html} from "lit-element";
import {routingMixin} from "./src/routing-mixin";
import {routingSelectors} from './src/selectors';
import {propertiesObserver} from "@uxland/uxl-utilities";
import {watch, connect} from "@uxland/lit-redux-connect";
const store = redux.createStore(redux.combineReducers({routing: reducer}));
const router = new Router(store.dispatch, document.baseURI);
initializeLinkClickSupport(router);
router.register({route: '/view1'}, {route: '/view2'}, {route: '/view3'}, {route: '/'});

// @ts-ignore
@customElement('router-demo-app')
export class RouterDemoApp extends propertiesObserver(routingMixin(connect(store), routingSelectors)(LitElement)) {

    render(){
        return html `
        <div>
        <a href="view1">To View1</a>
        <a href="view2">To View2</a>
        <a href="view3">To View3</a>
        <iron-pages attr-for-selected="name" selected="${this.page}">
            <demo-view1 name="/view1">
            <h1>View1</h1>
</demo-view1>
             <demo-view2 name="/view2">
             <h1>View 2</h1>
</demo-view2>
             <demo-view3 name="/view3">
             <h1>View 3</h1>
</demo-view3>
        </iron-pages>
        </div>`;
    }
    subroute = '';
    @property()
    page: string;

    @watch(routingSelectors.routeSelector)
    route: Route;
    routeChanged(newRoute: Route, old: Route) {
        this.page = newRoute.href;
        console.log('route changed');
    }
}
router.navigate((<any>window).location.href).then(() => document.body.appendChild(document.createElement('router-demo-app')));
