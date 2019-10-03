import '@polymer/iron-pages';
import { watch } from '@uxland/lit-redux-connect';
import { propertiesObserver } from '@uxland/uxl-utilities';
import { html, LitElement } from 'lit-element';
import { customElement, property } from 'lit-element/lib/decorators';
import * as redux from 'redux';
import { reducer, Route, Router } from '../src';
import initializeLinkClickSupport from '../src/link-click-support';
import { routingMixin } from '../src/routing-mixin';
import { routingSelectors } from '../src/selectors';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;
const store = redux.createStore(redux.combineReducers({ routing: reducer }), composeEnhancers());
const Routing = routingMixin(store, routingSelectors);
const router = new Router(store.dispatch, window.location.href);
initializeLinkClickSupport(router);
router.register({ route: 'view1' }, { route: 'view2' }, { route: 'view3' }, { route: '' });

@customElement('sub-route')
export class SubRouteApp extends Routing(propertiesObserver(LitElement)) {
  render() {
    return html`
      <div>subdemo</div>
    `;
  }

  isRouteActiveChanged(current: boolean, previous: boolean) {
    console.log('SubRoute - Active changed:', current, previous);
  }
}

@customElement('router-demo-app')
export class RouterDemoApp extends Routing(propertiesObserver(LitElement)) {
  render() {
    return html`
      <div>
        <a href="./view1">To View1</a>
        <a href="./view2">To View2</a>
        <a href="./view3">To View3</a>
        <iron-pages attr-for-selected="name" selected="${this.page}">
          <sub-route name="/view1"></sub-route>
          <demo-view2 name="/view2">
            <h1>View 2</h1>
          </demo-view2>
          <demo-view3 name="/view3">
            <h1>View 3</h1>
          </demo-view3>
        </iron-pages>
      </div>
    `;
  }
  @property()
  page: string;

  @watch(routingSelectors.routeSelector)
  route: Route;
  routeChanged(current: Route, previous: Route) {
    this.page = current.href;
    console.log('Route changed:', current, previous);
  }

  isRouteActiveChanged(current: boolean, previous: boolean) {
    console.log('Demo - Active changed:', current, previous);
  }
}
