import {clean} from "../../../src";
import {assert} from 'chai';
describe('when using `clean` method', () =>{
    it('should remove forward slashes', function () {
        assert.equal(clean('/test/something/'),'^/test/something');
    });
    it('should remove multiple forward slashes', function () {
        assert.equal(clean('///test/something///'), '^/test/something');
    });
    it('should leave the regular expression untouched', function () {
        assert.equal(clean(/(\d)/).toString(),/(\d)/.toString());
    });
});