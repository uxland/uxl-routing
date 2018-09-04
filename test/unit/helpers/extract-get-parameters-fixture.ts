import extractGetParameters from "../../../src/helpers/extract-get-parameters";
import {assert} from 'chai';

suite('when using `extractGetParameters` method', () =>{
    test('should return undefined if parameter is null, undefined or empty', () =>{
       assert.isUndefined(extractGetParameters(null));
        assert.isUndefined(extractGetParameters(undefined));
        assert.isUndefined(extractGetParameters(''));
    });
   test('should return undefined if no query string', () =>{
       assert.isUndefined(extractGetParameters('http://test.com'));
   });
   test('should return query string at end', () =>{
       assert.equal(extractGetParameters('test/43?search=43&sort=asc'), 'search=43&sort=asc');
       assert.equal(extractGetParameters('http://test.com/#/test/43?search=43&sort=asc'), 'search=43&sort=asc');
   });
});