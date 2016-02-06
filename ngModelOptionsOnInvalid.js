angular.module('NgModelOptionsOnInvalid', []).directive('ngModelOptionsOnInvalid', function () {
  return {
    require: ['ngModel', '^form'],
    controller: function ($element, $scope, $attrs) {
      var
        DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/,
        ngModelOptionsController = $element.controller('ngModel'),
        formController = $element.controller('form'),
        $options = $scope.$eval($attrs.ngModelOptionsOnInvalid);

      var unwatch = $scope.$watch(formController.$name + '.' + $attrs.name + '.$valid', function (newVal, oldVal) {
        if (newVal !== oldVal && newVal === false) {

          $options.updateOn.replace(DEFAULT_REGEXP, function() {
            $options.updateOnDefault = true;
            return ' ';
          });

          ngModelOptionsController.$$setOptions($options);

          unwatch();
        }
      });
    }
  };
});
