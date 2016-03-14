angular.module('lilarss').controller('AuthLoaderController', 
[ '$scope', '$rootScope', function($scope, $rootScope){
    $scope.loading = false;
    
    $rootScope.$on('$authRenewTokenStart', function(){
        $scope.loading = true;
    });
    
    $rootScope.$on('$authRenewTokenEnd', function(state){
        $scope.loading = false;
    });
}]);