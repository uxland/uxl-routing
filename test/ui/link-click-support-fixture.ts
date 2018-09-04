import {initializeLinkClickSupport} from '../../src/link-click-support';
import * as sinon from 'sinon';
const assert = chai.assert;

suite('link click support', () =>{
   test('click', () =>{
       const router: any = {
           navigate: sinon.stub()
       };
       initializeLinkClickSupport(router);
       let fix: HTMLDivElement = fixture('test-fixture');
       let link: HTMLAnchorElement = fix.querySelector('#link');
       link.click();
       assert.isTrue(router.navigate.calledOnce);
   })
});