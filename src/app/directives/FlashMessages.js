angular.module('lilarss')
       .directive('flashMessages', ['$timeout', '$compile', '$animateCss', 'FlashMessages', function($timeout, $compile, $animateCss, FlashMessages)
{
	return {
        restrict: 'E',
        scope: {
            key: '@',
            type: '@?'
        },
        template: '<div layout="row" layout-padding layout-align="center center" ng-if="messages.length > 0" class="md-cont-{{ type }} flash-messages-cont"> \
                        <div ng-repeat="error in messages">{{ error }}</div> \
                        <span flex></span> \
                        <md-button class="md-icon-button" ng-click="delete()"><md-icon>close</md-icon></md-button> \
                   </div>',
        link: function($scope, $elem, $attr, $ctrl){
            $scope.messages = FlashMessages.getAndFlush($scope.key);
            $scope.type = ($scope.type ? $scope.type : 'accent');
            
            if(!$scope.messages){
                $scope.messages = [];
            }
            
            var unbind = $scope.$on('FlashMessages.add.' + $scope.key, function($evt, data){
                $scope.messages = angular.copy(data); 
                FlashMessages.flush($scope.key);
            });
            
            $scope.delete = function(){
                $elem.find('.flash-messages-cont').slideUp(200, function(){
                    $scope.messages = [];
                    if(!$scope.$$phase)
                        $scope.$digest();    
                });
            };
            
            $scope.$on('$destroy', function(){
                unbind(); 
            });
            
            FlashMessages.registerScope($scope);
        }
	};
}]);