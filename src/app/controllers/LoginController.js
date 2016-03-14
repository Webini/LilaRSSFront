angular.module('lilarss').controller('LoginController', 
[ '$scope', 'AuthService', 'FlashMessages', '$state', '$stateParams', function($scope, AuthService, FlashMessages, $state, $stateParams){    
    $scope.login = {
        email: $stateParams.email
    };
    
    $scope.loading = false;
    $scope.error = null;
    
    $scope.login = function(){
        if(!$scope.form.$valid){
            return; 
        }
        
        $scope.loading = true;
        
        AuthService.login($scope.login.email, $scope.login.password, $scope.login.remember).then(
            function(data){
                $scope.error = null;  
                $state.go('dashboard');    
            },
            function(err){
                $scope.error = err;
            }
        ).finally(function(){
            $scope.loading = false;  
        });
    }
}]);