import test from 'ava';
import jsdom from 'jsdom';

// Angular dependencies
global.document = jsdom.jsdom('<!doctype html><html ng-app="app"><head><meta charset="utf-8"></head><body></body></html>');
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
require('../ngModelOptionsOnInvalid');

angular.module('app', ['NgModelOptionsOnInvalid']);


let $rootScope, $compile;

test.beforeEach(angular.mock.module('app'));

test.beforeEach(angular.mock.inject((_$rootScope_, _$compile_) => {
  $rootScope = _$rootScope_;
  $compile = _$compile_;
}));


test.serial('change updateOn from "blur" to "default" on invalid', t => {
  const scope = $rootScope.$new();

  scope.register = {};

  const element = $compile(`
    <form name="registerForm">
      <input
        type="email"
        name="email"
        ng-model="register.email"
        ng-model-options="{updateOn: 'blur'}"
        ng-model-options-on-invalid="{updateOn: 'default'}">

      <button>Click me to trigger a blur</button>
    </form>
  `)(scope);


  scope.registerForm.email.$setViewValue('karl@example.com');

  // Assert that scope value not yet updated because of updateOn: 'blur'
  t.is(typeof scope.register.email, 'undefined');

  // Blur the input and assert the value
  element[0].querySelector('button').click();
  t.is(scope.register.email, 'karl@example.com');

  // Set the element to an invalid value and blur the input to cause ng-model-options to be updated
  scope.registerForm.email.$setViewValue('karl@example.');
  element[0].querySelector('button').click();

  // Test that ng-model-options has been set to updateOn: 'default' (scope updates instantly)
  scope.registerForm.email.$setViewValue('john@example.com');
  t.is(scope.register.email, 'john@example.com');
});


test.serial('remove debounce on invalid', t => {
  const scope = $rootScope.$new();

  scope.register = {};

  const element = $compile(`
    <form name="registerForm">
      <input
        type="email"
        name="email"
        ng-model="register.email"
        ng-model-options="{updateOn: 'default', debounce: 200}"
        ng-model-options-on-invalid="{updateOn: 'default'}">

      <button>Click me to trigger a blur</button>
    </form>
  `)(scope);

  scope.registerForm.email.$setViewValue('karl@example.com');

  // Assert that scope value not yet updated because of the debounce option
  t.is(typeof scope.register.email, 'undefined');

  // Click on button to cancel the debounce
  // TODO: Figure out a way to test the delay properly, possibly with:
  // - await delay(200) with async function https://github.com/sindresorhus/delay
  // - $timeout.flush() like in ngModelSpec.js https://github.com/angular/angular.js/blob/ba6d37756e9553afa2ebdda18fb52d49c911e3aa/test/ng/directive/ngModelSpec.js#L1969
  element[0].querySelector('button').click();

  t.is(scope.register.email, 'karl@example.com');

  // Set the element to an invalid value and cancel the debounce by clicking on the button to cause ng-model-options to be updated
  scope.registerForm.email.$setViewValue('karl@example.');
  element[0].querySelector('button').click();

  // Test that ng-model-options has been set without a debounce delay
  scope.registerForm.email.$setViewValue('john@example.com');
  t.is(scope.register.email, 'john@example.com');
});
