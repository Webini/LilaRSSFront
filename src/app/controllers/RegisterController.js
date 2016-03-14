angular.module('lilarss').controller('RegisterController', 
[ '$scope', 'AuthService', 'FlashMessages', '$state', function($scope, AuthService, FlashMessages, $state){    
    $scope.user    = {};
    $scope.loading = false;
           
    $scope.register = function() {
        if(!$scope.form.$valid){
            return; 
        }
        
        $scope.loading = true;
        
        AuthService.register($scope.user).then(
            function(user){
                $scope.error = null;
                FlashMessages.add('register.success', 'REGISTER_SUCCESS');
                $state.go('login', { email: user.email });
            },
            function(err){
                $scope.error = err;
            }
        ).finally(function(){
            $scope.loading = false;  
        });
    };
}]);