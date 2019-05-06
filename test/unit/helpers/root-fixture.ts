import {root} from "../../../src";

import {assert} from 'chai';

const routes = (...args) => args.map(r => {
    return { route: r };
});
const rootTestCases = [
    {
        source: 'http://site.com', routes: routes(),
        expected: 'http://site.com'
    },
    {
        source: 'https://site.com', routes: routes(),
        expected: 'https://site.com'
    },
    {
        source: 'http://site.com/a/b', routes: routes(),
        expected: 'http://site.com/a/b'
    },
    {
        source: 'http://site.com/a/b/', routes: routes(),
        expected: 'http://site.com/a/b'
    },
    {
        source: 'http://site.com/a/b/', routes: routes('/b'),
        expected: 'http://site.com/a'
    },
    {
        source: 'http://site.com/a/b/', routes: routes('/b', '/a/b/'),
        expected: 'http://site.com'
    },
    {
        source: 'http://site.com/a/b/', routes: routes('/a/b/', '/b', '/c'),
        expected: 'http://site.com'
    },
    {
        source: 'http://site.com/a/b/', routes: routes('/d/', '/a/b/', '/b', '/c'),
        expected: 'http://site.com'
    },
    {
        source: 'http://site.com/something/else/brother/blah', routes: routes('/d/', '/a/b/', '/b', '/c'),
        expected: 'http://site.com/something/else/brother/blah'
    },
    {
        source: 'http://site.com/something/else', routes: routes(''),
        expected: 'http://site.com/something/else'
    },
    {
        source: 'http://site.com/something/else', routes: routes('*'),
        expected: 'http://site.com/something/else'
    }
];

describe('when using `root` method', () =>{
    rootTestCases.forEach(testCase =>{
        it(`should get the root as ${testCase.expected} if args are source: ${testCase.source} routes: ${testCase.routes.map(r => r.route).join(', ')}`, () =>{
           assert.equal(root(testCase.source, testCase.routes), testCase.expected);
        });
    });
});