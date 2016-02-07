import test from 'ava';
import jsdom from 'jsdom';
import fs from 'fs';


test.before(t => {
  // Angular dependencies
  const angularScript = fs.readFileSync('../node_modules/angular/angular.js', 'utf8');
  global.document = jsdom.jsdom(`<!doctype html><html><head><meta charset="utf-8"><script>${angularScript}</script></head><body ng-app="app"><div><div ng-if="notInScope">aabbcc</div></div></body></html>`);
  global.window = document.defaultView;
  global.Node = global.window.Node;

  require('angular/angular');

  // Make angular available for angular-mocks
  global.angular = global.window.angular;

  // Set some window properties required by angular-mocks
  global.window.mocha = {};
  global.window.beforeEach = test.beforeEach;
  global.window.afterEach = test.afterEach;

  require('angular-mocks');

  angular.module('app', ['NgModelOptionsOnInvalid']);
});


test('a', t => {
  angular.mock.inject(($rootScope, $compile) => {
    const scope = $rootScope.$new();
    const element = $compile('<div><div ng-if="notInScope">aabbcc</div></div>')(scope);
    $rootScope.$digest();
    const abc = element.html() || '';
    console.log('abc', abc);
    t.false(abc.includes('aabbcc'));
  });
});
