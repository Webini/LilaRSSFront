angular.module('lilarss')
       .config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
           
    $urlRouterProvider.otherwise("/404")   
   
    $stateProvider
        .state('404', {
            url: '/404'
        })
        .state('register', {
            url: '/register',
            templateUrl: '/partials/register.html',
            controller: 'RegisterController'
        })
        .state('login', {
            url: '/login',
            templateUrl: '/partials/login.html'
        })
        .state('app', {
            views: {
                menu: { templateUrl: '/partials/menu.html' }
            }
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: '/partials/layout.html'
        })
    ;
}]).run([ '$rootScope', '$state', 'AuthService', function ($rootScope, $state, AuthService) {
   /* $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){ 
        var name = toState.name.split('.')[0];
        
        if(name != '404'){
            if (!AuthService.isLogged() && name != 'login' && name != 'register') {
                $state.go('login');
                event.preventDefault(); 
            } 
            else if (AuthService.isLogged() && (name == 'login' || name == 'register')) {
                $state.go('dashboard');
                event.preventDefault(); 
            }
        }
    });*/
}]);