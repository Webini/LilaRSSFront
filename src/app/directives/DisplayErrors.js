angular.module('lilarss').directive('displayErrors', ['$mdToast', '$translate', function($mdToast, $translate){
    return {
        scope: {
            error: '=',
            defaultMessage: '@?message',
            fieldMessage: '@?',
            position: '@?'
        },
        controller: [ '$scope', function($scope){
            var self   = this;
            this.defaultMessage = 'DEFAULT_ERROR_MESSAGE';
            this.fieldsMessage  = 'DEFAULT_FIELDS_ERROR_MESSAGE';
            
            /**
             * Display toast
             * @return {undefined}
             */
            this.displayMessage = function(error){
                if(!error){
                    return;
                }
                
                //if we have fields field
                if(error.fields){                    
                    this.getMessage(error.fields)
                        .then(function(text){ $scope.displayToast(text); });
                }
                //if we have a translationKey field
                else if(error.translationKey){
                    $translate(error.translationKey).then(
                        function(text){ return text; },
                        function(key){ return error.translationKey; }
                    ).then(function(text){ $scope.displayToast(text); })
                }
                //else default message
                else if(error){
                    $translate(this.defaultMessage).then(
                        function(text){ return text; },
                        function(key){ return self.defaultMessage; }
                    ).then(function(text){ $scope.displayToast(text); })
                }
            };
            
            /**
             * Retreive message for fields
             * @return {promise}
             */
            this.getMessage = function(fields){
                return $translate(fields).then(
                    function(translated){
                        var out = '';
                        for(var i = 0, len = fields.length, stop = len-1; i < len; i++){
                            out += translated[fields[i]];
                            out += (i < stop ? ', ' : '');
                        }
                        
                        return $translate(self.fieldsMessage, { fields: out, count: fields.length });
                    },
                    function(err){
                        //if not translation found, we try with defaultMessage
                        return $translate(self.defaultMessage);
                    }
                ).then(
                    function(translated){
                        return translated;
                    },
                    function(key){
                        return key;
                    }
                ); 
            };
            
            /**
             * Define default message
             * @param {string} defaultMessage When no fields a defined in error
             * @param {string} defaultFields When fields are defined in error
             * @return {undefined}
             */
            this.setDefaultMessages = function(defaultMessage, defaultFields){
                if(defaultMessage){
                    this.defaultMessage = defaultMessage;
                }
                
                if(defaultFields){
                    this.fieldsMessage = defaultFields;
                }
            }
        }],
        link: function($scope, $el, $attr, ctrl){
            ctrl.setDefaultMessages($scope.defaultMessage, $scope.fieldsMessage);
            $scope.message = '';
            
            if(!$scope.position){
                $scope.position = 'bottom left';
            }
            
            var $parent = $el.parents('md-content').first();
            
            /**
             * Display toast
             * @return {undefined}
             */
            $scope.displayToast = function(message){
                $scope.message = message;
                console.debug('DISPLAY TOAST', message);
                $mdToast.show({
                    template: '<md-toast> \
                                    <span flex>{{ message }}</span> \
                                    <md-button class="md-icon-button" ng-click="removeToast()"> \
                                        <md-icon>close</md-icon> \
                                    </md-button> \
                                </md-toast>',
                    scope: $scope,
                    preserveScope: true,
                    hideDelay: false,
                    position: $scope.position,
                    parent: $parent
                });
            };
            
            /**
             * Remove toast
             * @return {promise}
             */
            $scope.removeToast = function(){
               return $mdToast.hide();
            };
            
            $scope.$watch('error', function(newVal, oldVal){
                console.debug('ERROR CHANGED', newVal, oldVal);
                $scope.removeToast().finally(function(){
                    ctrl.displayMessage(newVal);
                });
            });
        }
    };
}]);