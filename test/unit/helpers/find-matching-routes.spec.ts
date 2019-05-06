import {findMatchingRoutes} from "../../../src";
import {assert} from 'chai';
const routes = (...args: string[]) => args.map(arg =>({route: arg}));

describe('when using `findMatchingRoutes` method', () =>{
   test('should match a url if we have an empty string as a pattern', () =>{
       assert.exists(findMatchingRoutes('http://site.com/app/users', routes('')));
       assert.exists(findMatchingRoutes('', routes('')));
       assert.exists(findMatchingRoutes('/some/path', routes('')));
   });
    test('should not match if there is no pattern matching', function () {
        assert.isEmpty(findMatchingRoutes('http://site.com/app/users/', routes('missing')));
    });
    test('should match and return parameters', function () {
        assert.deepEqual(findMatchingRoutes('http://site.com/app/users/42', routes('http://site.com/app/users/:id'))[0].params, { id: '42' });
    });
    test('should match multiple parameters', function () {
        assert.deepEqual(findMatchingRoutes('http://site.com/app/users/42/save', routes('http://site.com/app/users/:id/:action'))[0].params, { id: '42', action: 'save' });
    });
    test('should not greedily match extra parameters at the end of a url if not terminated by a wildcard', function () {
        assert.isEmpty(findMatchingRoutes('/app/users/', routes('/app')));
        assert.isEmpty(findMatchingRoutes('/app/users/42/save/something/else', routes('/app/users/:id/:action')));
        assert.isEmpty(findMatchingRoutes('/app/something/users/blah', routes('/app/*/users')));
    });
    test('should match if there is a wildcard used', function () {
        assert.isNotEmpty(findMatchingRoutes('/app/users/', routes('app/*')));
        assert.isNotEmpty(findMatchingRoutes('/users/mmm/save/nnn/blah', routes('*/users/*/save/*/blah')));
        assert.deepEqual(findMatchingRoutes('/app/users/comments/save', routes('app/*/comments/:action'))[0].params, { action: 'save' });
    });
    test('should return all matching subroutes if arg supplied', () =>{
        assert.equal(findMatchingRoutes('/users/mmm/save/nnn/blah', routes('*/users/*/save/*/blah', '/users', '/users/mmm', 'app/*/comments/:action'), true).length, 3);
    });
});