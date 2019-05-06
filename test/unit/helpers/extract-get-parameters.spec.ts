import {extractGetParameters} from "../../../src";
import {assert} from 'chai';

describe('when using `extractGetParameters` method', () =>{
    it('should return undefined if parameter is null, undefined or empty', () =>{
       assert.isUndefined(extractGetParameters(null));
        assert.isUndefined(extractGetParameters(undefined));
        assert.isUndefined(extractGetParameters(''));
    });
    it('should return undefined if no query string', () =>{
       assert.isUndefined(extractGetParameters('http://test.com'));
   });
    it('should return query string at end', () =>{
       assert.equal(extractGetParameters('test/43?search=43&sort=asc'), 'search=43&sort=asc');
       assert.equal(extractGetParameters('http://test.com/#/test/43?search=43&sort=asc'), 'search=43&sort=asc');
   });
});