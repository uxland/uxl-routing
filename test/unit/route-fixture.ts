import {assert} from 'chai';
import {routeReducer, setRouteActionCreator} from '../../src/route';
import {Route} from "../../src/reducer";
const setRouteActionName = 'uxl-routing:set-route:action';
suite('route reducer suite', () =>{
    test('initial state', () =>{
       const state = routeReducer(undefined, {type: '@@NOP'});
       assert.deepEqual(state, {href: ''});
    });
    test('sets route', () =>{
        const initialRoute: Route={
            href: 'myroute'
        };
        const route: Route<any> = {
            href: 'http://site.com/user/42/save?answer=42',
            params:{id: 42, action: 'save'},
            query:'answer=42'
        };
        Object.freeze(initialRoute);
        let result = routeReducer(initialRoute, {type: setRouteActionName, payload: route});
        assert.deepEqual(route, result);
    });
    test('returns old state if action is different', () =>{
        const route: Route = {
            href: 'http://site.com/user/42/save?answer=42',
            params:{id: 42, action: 'save'},
            query:'answer=42'
        };
        let result = routeReducer(route, {type: 'other action', payload: route});
        assert.strictEqual(route, result);
    });
    test('action creator', () =>{
        const route: Route = {
            href: 'http://site.com/user/42/save?answer=42',
            params:{id: 42, action: 'save'},
            query:'answer=42'
        };
        assert.deepEqual(setRouteActionCreator(route), {type: setRouteActionName, payload: route});
    });
});
