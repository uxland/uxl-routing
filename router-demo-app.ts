import * as _ from 'lodash-es';
import '@polymer/iron-pages';
import * as uxlRedux from '@uxland/uxl-redux';
import {customElement, property} from "@uxland/uxl-polymer2-ts";
import {reducer, Route} from './src/reducer';
import * as redux from 'redux';
import {Router} from "./src/router";
import initializeLinkClickSupport from "./src/link-click-support";
import {LitElement,html} from "@polymer/lit-element";
import {routingMixin} from "./src/routing-mixin";
import {routingSelectors} from './src/selectors';
const store = redux.createStore(redux.combineReducers({routing: reducer}));
const Redux = uxlRedux.reduxMixin(store);
const router = new Router(store.dispatch, document.baseURI);
initializeLinkClickSupport(router);
router.register({route: '/view1'}, {route: '/view2'}, {route: '/view3'}, {route: '/'});

@customElement('router-demo-app')
export class RouterDemoApp extends routingMixin(Redux, routingSelectors)(LitElement) {

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

    @property({statePath: 'route', observer: 'routeChanged'})
    route: Route;

    routeChanged(newRoute: Route, old: Route) {
        this.page = newRoute.href;
        console.log('route changed')
    }
}
router.navigate(window.location.href).then(() => document.body.appendChild(document.createElement('router-demo-app')));