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


test.beforeEach(t => {
  angular.mock.module('app');
});

test('reset ng-model-options on invalid', t => {
  angular.mock.inject(($rootScope, $compile) => {
    const scope = $rootScope.$new();

    scope.register = {};

    const element = $compile(`
      <form name="registerForm">
        <input
          type="email"
          name="email"
          ng-model="register.email"
          ng-model-options="{allowInvalid: true, updateOn: 'blur'}"
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

    // Set the element to invalid and blur the input to cause ng-model-options to be updated
    scope.registerForm.email.$setViewValue('karl@example.');
    element[0].querySelector('button').click();

    // Test that ng-model-options has been set to updateOn: 'default' (scope updates instantly)
    scope.registerForm.email.$setViewValue('john@example.com');
    t.is(scope.register.email, 'john@example.com');
  });
});
