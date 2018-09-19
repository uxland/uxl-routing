import clean from "../../../src/helpers/clean";
import {assert} from 'chai';
suite('when using `clean` method', () =>{
    test('should remove forward slashes', function () {
        assert.equal(clean('/test/something/'),'^/test/something');
    });
    test('should remove multiple forward slashes', function () {
        assert.equal(clean('///test/something///'), '^/test/something');
    });
    test('should leave the regular expression untouched', function () {
        assert.equal(clean(/(\d)/).toString(),/(\d)/.toString());
    });
});