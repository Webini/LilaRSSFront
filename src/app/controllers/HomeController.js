angular.module('lilarss').controller('HomeController', 
[ 'AuthService', '$state', function(AuthService, $state){    
    
    if(AuthService.isAuthenticated()){
        $state.go('dashboard');
    }
    else{
        $state.go('login');
    }
}]);