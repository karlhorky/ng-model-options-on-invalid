angular.module('NgModelOptionsOnInvalid', []).directive('ngModelOptionsOnInvalid', function () {
  return {
    require: ['ngModel', '^form'],
    controller: function ($element, $scope, $attrs) {
      var
        ngModelOptionsController = $element.controller('ngModel'),
        formController = $element.controller('form');

      var unwatch = $scope.$watch(formController.$name + '.' + $attrs.name + '.$valid', function (newVal) {
        if (newVal === false) {

        // TODO: get the options from the attr

        // var DEFAULT_REGEXP = /(\s+|^)default(\s+|$)/;
        // $options = copy($scope.$eval($attrs.ngModelOptions))
        // $options.updateOn.replace(DEFAULT_REGEXP, function() {
        //   $options.updateOnDefault = true;
        //   return ' ';
        // })
        // ngModelOptionsController.$$setOptions($options);



          ngModelOptionsController.$$setOptions({
            updateOn: 'default'
          });

          unwatch();
        }
      });
    }
  };
});
