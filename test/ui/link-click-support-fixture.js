import {initializeLinkClickSupport} from '../../src/link-click-support';
import * as sinon from 'sinon';
const assert = chai.assert;

suite('link click support', () =>{
   test('click', () =>{
       const router = {
           navigate: sinon.stub()
       };
       initializeLinkClickSupport(router);
       let fix = fixture('test-fixture');
       let link = fix.querySelector('#link');
       link.click();
       assert.isTrue(router.navigate.calledOnce);
   })
});