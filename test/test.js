import test from 'ava';
import jsdom from 'jsdom';


test.before(t => {
  // Angular dependencies
  global.document = jsdom.jsdom('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>');
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
