angular.module('lilarss')
       .config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
           
    $urlRouterProvider.otherwise("/404");
    $urlRouterProvider.deferIntercept();
   
    $stateProvider
        .state('404', {
            url: '/404'
        })
        .state('hom', {
            url: '/',
            controller: 'HomeController'
        })
        .state('register', {
            url: '/register',
            templateUrl: '/partials/register.html',
            controller: 'RegisterController'
        })
        .state('login', {
            url: '/login?email',
            templateUrl: '/partials/login.html',
            controller: 'LoginController', 
            params: { email: null }
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
}]).run([ '$rootScope', '$urlRouter', '$state', 'AuthService', function ($rootScope, $urlRouter, $state, AuthService) {

    $rootScope.$on('$locationChangeSuccess', function(e) {
        console.debug('locationChangeSuccess', !AuthService.isAuthenticated(), AuthService.isRenewableToken());
        
        if(!AuthService.isAuthenticated() && AuthService.isRenewableToken()){
            // Prevent $urlRouter's default handler from firing
            e.preventDefault();

            AuthService.renewToken().finally(function() {
                // Once the user has logged in, sync the current URL
                // to the router:
                $urlRouter.sync();
            });
        }
    });
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){ 
        var name = toState.name.split('.')[0];
        
        if(name != '404'){
            if (!AuthService.isAuthenticated() && name != 'login' && name != 'register') {
                $state.go('login');
                event.preventDefault(); 
            } 
            else if (AuthService.isAuthenticated() && (name == 'login' || name == 'register')) {
                $state.go('dashboard');
                event.preventDefault(); 
            }
        }
    });
    
    $urlRouter.listen();
}]);