import {assert} from 'chai';
import {routeReducer, setRouteActionCreator} from '../../src';
import {Route} from "../../src";
const setRouteActionName = 'uxl-routing:set-route:action';
describe('route reducer suite', () =>{
    it('initial state', () =>{
       const state = routeReducer(undefined, {type: '@@NOP'});
       assert.deepEqual(state, {href: ''});
    });
    it('sets route', () =>{
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
    it('returns old state if action is different', () =>{
        const route: Route = {
            href: 'http://site.com/user/42/save?answer=42',
            params:{id: 42, action: 'save'},
            query:'answer=42'
        };
        let result = routeReducer(route, {type: 'other action', payload: route});
        assert.strictEqual(route, result);
    });
    it('action creator', () =>{
        const route: Route = {
            href: 'http://site.com/user/42/save?answer=42',
            params:{id: 42, action: 'save'},
            query:'answer=42'
        };
        assert.deepEqual(setRouteActionCreator(route), {type: setRouteActionName, payload: route});
    });
});
