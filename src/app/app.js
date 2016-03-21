angular.module('lilarss', [
    'ngSanitize',
    'ngMaterial',
    'pascalprecht.translate',
    'ngRoute',
    'ui.router', 
    'ngMessages'
]).config([ '$locationProvider', function($locationProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]).config(['$translateProvider', function($translateProvider){
    
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.useLoaderCache(true);
    $translateProvider.useStaticFilesLoader({
        prefix: '/translations/',
        suffix: '.json'
    });
    
    var browserLang = (window.navigator.userLanguage || window.navigator.language).toLowerCase();
    
    if(browserLang != 'en' && browserLang != 'fr')
       browserLang = 'en';

    $translateProvider.preferredLanguage(browserLang);
    $translateProvider.use(browserLang); 
    $translateProvider.useMessageFormatInterpolation();
    
}]).config([ '$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
                      .primaryPalette('blue')
                      .accentPalette('indigo')
                      .warnPalette('deep-orange');
}]).config([ '$mdIconProvider', function($mdIconProvider){
    $mdIconProvider.fontSet('material', 'material');
}]);
    