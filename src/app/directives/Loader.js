angular.module('lilarss').directive('loader', [function(){
    return {
        transclude: true,
        template: '<div class="md-mask" layout="column" layout-align="center center"> \
                       <md-progress-circular md-diameter="96"></md-progress-circular> \
                       <ng-transclude></ng-transclude> \
                   </div>'
    };
}]);