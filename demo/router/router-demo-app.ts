import {html, LitElement} from 'lit-element/lit-element';
import '@polymer/iron-pages';
import * as uxlRedux from '@uxland/uxl-redux';
import {property, customElement} from "lit-element/lib/decorators";
import {reducer, Route} from '../../src/reducer';
import * as redux from 'redux';
import {Router} from "../../src/router";
import initializeLinkClickSupport from "../../src/link-click-support";
import {statePath} from "@uxland/uxl-redux/state-path";
import routingSelectors from "../../src/selectors";

const store = redux.createStore(reducer);
const Redux = uxlRedux.reduxMixin(store);
const router = new Router(store.dispatch, undefined, false);
initializeLinkClickSupport(router);
router.register({route: ''},{route: '/view1'}, {route: '/view2'}, {route: '/view3'});
router.navigate(location.href);
// @ts-ignore
@customElement('router-demo-app')
export class RouterDemoApp extends Redux(LitElement) {
    static get template() {
        return html `
        <div>
        <a href="view1">To View1</a>
        <a href="view2">To View2</a>
        <a href="view3">To View3</a>
        <iron-pages attr-for-selected="name" selected="[[page]]">
            <demo-view1 name="/view1">
            <h1>View1</h1>
</demo-view1>
             <demo-view2 name="/view2">
             <h1>View 2</h1>
</demo-view2>
             <demo-view3 name="/view3">
             <h1>View 3</h1>
</demo-view3>
        </iron-pages>;
        </div>`;
    }

    @property()
    page: string;

    @statePath(routingSelectors.routeSelector)
    route: Route;

    routeChanged(newRoute: Route, old: Route) {
        this.page = newRoute.href;
    }
}
