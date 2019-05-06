import {html, LitElement} from 'lit-element/lit-element';
import {property, query, customElement} from "lit-element/lib/decorators";
import {default as routingSelectors, RoutingSelectors} from "../../src/selectors";
import {routingMixin} from "../../src/routing-mixin";
const assert = chai.assert;
const fixtureElementName = 'test-fixture';
const defaultComponentName = 'custom-element';
const getComponentName = (nameBase) => {
    let counter = 0;
    return () => `${nameBase}${++counter}`;
};
const getDefaultComponentName = getComponentName(defaultComponentName);
const addComponentToFixture = (componentName) => {
    const container = fixture(fixtureElementName);
    const component = document.createElement(componentName);
    container.appendChild(component);
    return component;
};
/*
interface DefaultTestComponent {
    header: HTMLHeadElement;
}
*/

const createDefaultComponent = (selectors) => {
    const componentName = getDefaultComponentName();
    const reduxMixinMock = (p) => p;
    @customElement(componentName)
    class Component extends routingMixin(reduxMixinMock , selectors)(LitElement) {
        render(){
            return html `<h1 id="header">${this.message}</h1>`
        }
        @property()
        message = 'hello';
        @query('#header')
        header;
    }

    return addComponentToFixture(componentName);

};
suite('Given a routingMixin instance', () =>{
    suite('isRouteActive property', () =>{
        setup(() =>{

        });
        test('should be false by default', () =>{
            let component = createDefaultComponent(routingSelectors);
            assert.isFalse(component.isRouteActive);
        });
        test('should be true if route href is same as subroute', async() =>{
            let component = createDefaultComponent(routingSelectors);
            await component.updateComplete;
            component.subroute = '/site';
            await component.updateComplete;
            assert.isFalse(component.isRouteActive);
            component.route = {href: '/site'};
            await component.updateComplete;
            assert.isTrue(component.isRouteActive);
            component.route = undefined;
            await component.updateComplete;
            assert.isFalse(component.isRouteActive);
            component.route = {href: '/site'};
            await component.updateComplete;
            assert.isTrue(component.isRouteActive);
            component.subroute = undefined;
            await component.updateComplete;
            assert.isFalse(component.isRouteActive);
        });
        test('should be false if route is not defined', async() =>{
            let component = createDefaultComponent(routingSelectors);
            component.subroute = '/site';
            await component.updateComplete;
            assert.isFalse(component.isRouteActive);
        });
        test('should be false if subroute is not defined', async () =>{
            let component = createDefaultComponent(routingSelectors);
            component.route = {href: '/site'};
            await component.updateComplete;
            assert.isFalse(component.isRouteActive);
        });
        test('should be false if subroute and route href do not match', async() =>{
            let component = createDefaultComponent(routingSelectors);
            component.subroute = '/site';
            component.route = {href: '/'};
            await component.updateComplete;
            assert.isFalse(component.isRouteActive);
            component.route = {href: '/otherSite'};
            await component.updateComplete;
            assert.isFalse(component.isRouteActive);
        });
        test('should be true for parametrized subroutes', async () =>{
            let component = createDefaultComponent(routingSelectors);
            component.subroute = '/site/:foo/:bar';
            component.route = {href: '/site/42/54'};
            await component.updateComplete;
            assert.isTrue(component.isRouteActive);
        });
        test('should be true is route.href is a child route', async() =>{
            let component = createDefaultComponent(routingSelectors);
            component.subroute = '/company/:id';
            component.route = {href: '/company/42/users/17'};
            await component.updateComplete;
            assert.isTrue(component.isRouteActive);
        });
    });
});
