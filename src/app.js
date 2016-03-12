angular.module('lila-rss', [
    
    
]).config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider){
    $routeProvider.otherwise({redirectTo: '/dashboard'});

    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.useLoaderCache(true);
    $translateProvider.useStaticFilesLoader({
        prefix: '/translations/',
        suffix: '.json'
    });
    
    var browserLang = (lang || window.navigator.userLanguage || window.navigator.language).toLowerCase();
    
    if(browserLang != 'en' && browserLang != 'fr')
       browserLang = 'en';

    $translateProvider.preferredLanguage(browserLang);
    $translateProvider.use(browserLang); 
    $translateProvider.useMessageFormatInterpolation();
}])
    
    