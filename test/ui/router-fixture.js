import {Router} from "../../src/router";
import * as sinon from 'sinon';
const assert = chai.assert;
const delay = (amount = 50) => new Promise(resolve => setTimeout(resolve, amount));

suite('Given an instance of Router', () => {
    const root = document.URL;
    teardown(() =>{
        history.replaceState({}, '', root);
        sinon.reset();
        sinon.resetHistory();
        sinon.restore();
    })
    suite('when we give no routes', () => {
        suite('and we call the navigate method', () => {
            test('should return false', async () => {
                let router = new Router();
                let result = await router.navigate('/test');
                assert.isFalse(result);
            });
        })
    });
    suite('when we give routes', () => {
        suite('and we call the navigate method', () => {
            suite('with an existing route', () => {
                test('should return true', async () => {
                    let router = new Router();
                    router.register({route: '/test', handler: {canNavigateFrom: sinon.stub()}});
                    let result = await  router.navigate('/test');
                    assert.isTrue(result);
                });
                test('should dispatch an action', async () => {
                    let dispatch = sinon.stub();
                    let router = new Router(dispatch);
                    let route = {route: '/test', handler: {canNavigateFrom: sinon.stub()}};
                    router.register(route);
                    await router.navigate('/test');
                    assert.isTrue(dispatch.calledOnceWith({
                        type: 'uxl-routing:set-route:action',
                        payload: {href: '/test', params: undefined, query: undefined}
                    }));
                });
                test('should dispatch an action with payload setting query', async () => {
                    let dispatch = sinon.stub();
                    let router = new Router(dispatch);
                    let route = {route: '/test', handler: {canNavigateFrom: sinon.stub()}};
                    router.register(route);
                    await router.navigate('/test?search=42&order=desc');
                    assert.isTrue(dispatch.calledOnceWith({
                        type: 'uxl-routing:set-route:action',
                        payload: {href: '/test?search=42&order=desc', params: undefined, query: 'search=42&order=desc'}
                    }));
                });
                test('should invoke canNavigateFrom method on all current active routes that will be deactivated', async() =>{
                    let router = new Router();
                    let route1 ={route: '/company', handler:{canNavigateFrom: sinon.stub().returns(true)}};
                    let route2 = {route: '/company/departments', handler:{canNavigateFrom: sinon.stub().returns(true)}};
                    let route3 = {route: '/company/departments/users', handler:{canNavigateFrom: sinon.stub().returns(true)}};
                    let route4 = {route: '/company/departments/users/:userId', handler:{canNavigateFrom: sinon.stub().returns(true)}};
                    router.lastUrlResolved = '/company/departments/users/2';
                    router.register(route1, route2, route3, route4);
                    await router.navigate('/company/departments')
                    assert.isFalse(route1.handler.canNavigateFrom.called);
                    assert.isFalse(route2.handler.canNavigateFrom.called);
                    assert.isTrue(route3.handler.canNavigateFrom.calledOnce);
                    assert.isTrue(route4.handler.canNavigateFrom.calledOnce);
                });
                test('should invoke navigatedFrom method on all current active routes that will be deactivated', async() =>{
                    let router = new Router();
                    let route1 ={route: '/company', handler:{navigatedFrom: sinon.stub().returns(true)}};
                    let route2 = {route: '/company/departments', handler:{navigatedFrom: sinon.stub().returns(true)}};
                    let route3 = {route: '/company/departments/users', handler:{navigatedFrom: sinon.stub().returns(true)}};
                    let route4 = {route: '/company/departments/users/:userId', handler:{navigatedFrom: sinon.stub().returns(true)}};
                    router.lastUrlResolved = '/company/departments/users/2';
                    router.register(route1, route2, route3, route4);
                    await router.navigate('/company/departments')
                    assert.isFalse(route1.handler.navigatedFrom.called);
                    assert.isFalse(route2.handler.navigatedFrom.called);
                    assert.isTrue(route3.handler.navigatedFrom.calledOnce);
                    assert.isTrue(route4.handler.navigatedFrom.calledOnce);
                });
                test('should return false if navigating to same route', async () =>{
                    let dispatch = sinon.stub();
                    let router = new Router(dispatch);
                    router.lastUrlResolved = '/test';
                    let route = {route: '/test', handler: {canNavigateFrom: sinon.stub()}};
                    router.register(route);
                    let result = await router.navigate('/test');
                    assert.isFalse(result);
                    assert.isFalse(dispatch.calledOnceWith({
                        type: 'uxl-routing:set-route:action',
                        payload: {href: '/test', params: undefined, query: undefined}
                    }));
                });
                test('should interrupt current navigation', async() =>{
                    let dispatch = sinon.stub();
                    let router = new Router(dispatch);
                    router.lastUrlResolved = '/company';

                    let route1 = {route: '/company', handler: {canNavigateFrom: () => delay().then(() => true)}};
                    let route2 = {route: '/test', handler: {canNavigateFrom: sinon.stub()}};
                    let route3 = {route: '/new', handler: {canNavigateFrom: sinon.stub()}};
                    router.register(route1, route2, route3);
                    let navigation1 = router.navigate('/test');
                    let navigation2 = router.navigate('/new');
                    let result = await navigation1;
                    assert.isFalse(result);
                    assert.isFalse(dispatch.called);
                    result = await navigation2;
                    assert.isTrue(result);
                    assert.isTrue(dispatch.calledOnceWith({
                        type: 'uxl-routing:set-route:action',
                        payload: {href: '/new', params: undefined, query: undefined}
                    }));
                })
            });
            suite('with an unexisting route', () => {
                test('should return false', async () => {
                    let router = new Router();
                    router.register({route: '/test', handler: null});
                    let result = await router.navigate('test2');
                    assert.isFalse(result);
                });
                test('should not dispatch any action', async () => {
                    let dispatch = sinon.stub();
                    let router = new Router(dispatch);
                    let route = {route: '/test', handler: {canNavigateFrom: sinon.stub()}};
                    let route2 = {route: '/test-other', handler: {canNavigateFrom: sinon.stub()}};
                    router.register(route);
                    router.register(route2);
                    await router.navigate('test2');
                    assert.isFalse(dispatch.called);
                });
            });
            suite('with an existing parametrized route', () => {
                test('should dispatch an action with params', async () => {
                    let dispatch = sinon.stub();
                    let router = new Router(dispatch);
                    let route = {route: '/test/:id/:mode', handler: {canNavigateFrom: sinon.stub()}};
                    router.register(route);
                    await router.navigate('/test/41/test?search=42&order=desc');
                    assert.isTrue(dispatch.calledOnceWith({
                        type: 'uxl-routing:set-route:action',
                        payload: {href: '/test/41/test?search=42&order=desc', params: {id: '41', mode: 'test'}, query: 'search=42&order=desc'}
                    }));
                });
            });
        });
    })
});