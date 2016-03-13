angular.module('lilarss')
       .directive('identicalWith', [function(){
           
    return {
        require: 'ngModel',
        scope: {
            identicalWith: '='
        },
        link: function($scope, $el, $attr, ngModel){            
            ngModel.$validators.identicalWith = function(modelValue) {
                return modelValue == $scope.identicalWith;
            };  
                      
            $scope.$watch('identicalWith', function(newVal, oldVal){
                ngModel.$validate();
            });
        }
    };         
}]);