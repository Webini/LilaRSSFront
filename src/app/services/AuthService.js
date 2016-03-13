angular.module('lilarss')
       .service('AuthService', [ '$http', '$q', function($http, $q){
    var AuthService = function(){
        this.user = null;
    };
    
    /**
     * Register an user
     * @return {promise}
     */
    AuthService.prototype.register = function(user){
        return $http.post('/user/create', user);
    };
    
    AuthService.prototype.isLogged = function(){
        return (this.user !== null);  
    };  
           
    return new AuthService();
}]);