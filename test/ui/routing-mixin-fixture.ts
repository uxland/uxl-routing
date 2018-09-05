import createMockStore from 'redux-mock-store';
import {LitElement, html} from '@polymer/lit-element/lit-element';
import {customElement, item, property} from "@uxland/uxl-polymer2-ts";
import {Store} from "redux";
import {default as routingSelectors, RoutingSelectors} from "../../src/selectors";
import {IRoutingMixinBase, routingMixin} from "../../src/routing-mixin";
const assert = chai.assert;
const fixtureElementName = 'test-fixture';

const defaultComponentName = 'custom-element';
const getComponentName = (nameBase: string) => {
    let counter = 0;
    return () => `${nameBase}${++counter}`;
};
const getDefaultComponentName = getComponentName(defaultComponentName);
const addComponentToFixture = <T>(componentName: string) => {
    const container: HTMLDivElement = fixture(fixtureElementName);
    const component: T = <any>document.createElement(componentName);
    container.appendChild(<any>component);
    return component;
};
interface DefaultTestComponent extends IRoutingMixinBase {
    header: HTMLHeadElement;
}

const createDefaultComponent: (selectors: RoutingSelectors) => DefaultTestComponent = (selectors) => {
    const componentName = getDefaultComponentName();
    const reduxMixinMock = (p) => p;
    @customElement(componentName)
    class Component extends routingMixin(reduxMixinMock , selectors)(LitElement) implements DefaultTestComponent {
        _render(props: Component){
            return html `<h1 id="header">${props.message}</h1>`
        }
        @property()
        message: 'hello';
        @item('header')
        header: HTMLHeadElement;
    }

    return addComponentToFixture(componentName);

};
suite('Given a routingMixin instance', () =>{
    suite('isRouteActive property', () =>{
        setup(() =>{

        })
        test('should be false by default', () =>{
            let component = createDefaultComponent(routingSelectors);
            assert.isFalse(component.isRouteActive);
        });
        test('should be true if route href is same as subroute', async() =>{
            let component = createDefaultComponent(routingSelectors);
            await component.renderComplete;
            component.subroute = '/site';
            await component.renderComplete;
            assert.isFalse(component.isRouteActive);
            component.route = {href: '/site'};
            await component.renderComplete;
            assert.isTrue(component.isRouteActive);
            component.route = undefined;
            await component.renderComplete;
            assert.isFalse(component.isRouteActive);
            component.route = {href: '/site'};
            await component.renderComplete;
            assert.isTrue(component.isRouteActive);
            component.subroute = undefined;
            await component.renderComplete;
            assert.isFalse(component.isRouteActive);
        });
        test('should be false if route is not defined', async() =>{
            let component = createDefaultComponent(routingSelectors);
            component.subroute = '/site';
            await component.renderComplete;
            assert.isFalse(component.isRouteActive);
        });
        test('should be false if subroute is not defined', async () =>{
            let component = createDefaultComponent(routingSelectors);
            component.route = {href: '/site'};
            await component.renderComplete;
            assert.isFalse(component.isRouteActive);
        });
        test('should be false if subroute and route href do not match', async() =>{
            let component = createDefaultComponent(routingSelectors);
            component.subroute = '/site';
            component.route = {href: '/'};
            await component.renderComplete;
            assert.isFalse(component.isRouteActive);
            component.route = {href: '/otherSite'};
            await component.renderComplete;
            assert.isFalse(component.isRouteActive);
        });
        test('should be true for parametrized subroutes', async () =>{
            let component = createDefaultComponent(routingSelectors);
            component.subroute = '/site/:foo/:bar';
            component.route = {href: '/site/42/54'};
            await component.renderComplete;
            assert.isTrue(component.isRouteActive);
        });
        test('should be true is route.href is a child route', async() =>{
            let component = createDefaultComponent(routingSelectors);
            component.subroute = '/company/:id';
            component.route = {href: '/company/42/users/17'};
            await component.renderComplete;
            assert.isTrue(component.isRouteActive);
        });
    });
    /*suite('page property', () =>{
        let mockStore: any;
        setup(() =>{
            mockStore = createMockStore();
        })
        test('should be undefined if is not active', async() =>{
            let component = createDefaultComponent(routingSelectors);
            await component.renderComplete;
            assert.isUndefined(component.page);
        });
        test('should be undefined if component is target route', async() =>{
            let component = createDefaultComponent(routingSelectors);
            component.subroute = '/company/users';
            component.route = {href: '/company/users'};
            await component.renderComplete;
            assert.isUndefined(component.page);
            component.route = {href: '/company/users/me'};
            component.route = {href: '/company/users'};
            await component.renderComplete;
            assert.isUndefined(component.page);
        });
        test('should be the next child in the route', async() =>{
            let component = createDefaultComponent(routingSelectors);
            component.subroute = '/company/users';
            component.route = {href: '/company/users/me'};
            await component.renderComplete;
            assert.equal(component.page, 'me');
            component = createDefaultComponent(routingSelectors);
            component.subroute = '/company/users/:id';
            component.route = {href: '/company/users/me/info/address'};
            await component.renderComplete;
            assert.equal(component.page, 'info');
        })
        test('should be default page if is target route', async() =>{
            let component = createDefaultComponent(routingSelectors);
            component.subroute = '/company/users';
            component.route = {href: '/company/users'};
            component.defaultPage = 'def-page';
            await component.renderComplete;
            assert.equal(component.page, 'def-page');
            component.route = {href: '/company/users/me'};
            component.route = {href: '/company/users'};
            await component.renderComplete;
            assert.equal(component.page, 'def-page');
        })
    });*/
});
