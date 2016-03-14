angular.module('lilarss')
	   .service('FlashMessages', ['$translate',
function($translate){
    var lang = $translate.use();

	var FlashMessages = function(){
		this.messages = { };
        this._scopes = [];
	}; 
    
    /**
     * Vérifie si le flash message avec la clée key existe
     * @param string key La clée
     * @return boolean
     */
    FlashMessages.prototype.has = function(key){
        return (typeof this.messages[key] != 'undefined');
    };
    
    /**
     * Récupère le message sans flush
     * @param string key La clée
     * @return array
     */
    FlashMessages.prototype.get = function(key){
        return this.messages[key];
    };
    
    /**
     * Récupère le message et flush cet id
     * @param string key La clée
     * @return array
     */
    FlashMessages.prototype.getAndFlush = function(key){
        return this.flush(key);
    };
    
    /**
     * Flush les data du key
     * @return value du key
     */
    FlashMessages.prototype.flush = function(key){
        var value = this.messages[key];
        delete this.messages[key];
        this._dispatch('remove', key, value);
        
        return value;
    }
    
    /**
     * Ajoute un flash message
     * @return self
     */
    FlashMessages.prototype.add = function(key, value){
        var self = this;
        $translate(value).then(
            function(result){
                return result;
            },
            function(error){
                return value;      
            }
        ).then(function(translation){
            if(self.has(key)){
                self.messages[key].push(translation);
            }
            else{
                self.messages[key] = [ translation ];
            }
            
            self._dispatch('add', key, self.get(key));
        });
        console.debug(this);
        return this;
    };
    
    /**
     * Recherche le scope dans notre tableau
     * @return int or null
     */
    FlashMessages.prototype._findScope = function($scope){
        for(var i = 0, sz = this._scopes.length; i < sz; i++){
            if(this._scopes[i] == $scope){
                return i;
            }
        }
        return null;
    };
    
    /**
     * Enleve un scope de la liste
     */
    FlashMessages.prototype.removeScope = function($scope){
        var offset = this._findScope($scope);
        if(offset !== null){
            var item = this._scopes[offset];
            this._scopes.splice(offset, 1);
            item.unbind();
            return true;
        }
        
        return false;
    };
    
    /**
     * Disptach un message au scopes
     * @param string type add || remove
     * @param string name Nom du flashmessage
     * @param array value Valeur du(des) message(s)  
     */
    FlashMessages.prototype._dispatch = function(type, name, data){
        var evtName = 'FlashMessages.' + type + '.' + name;
        for(var i = 0, sz = this._scopes.length; i < sz; i++){
            this._scopes[i].scope.$emit(evtName, data);
        }
    };
    
    /**
     * Enregistre un nouveau scope
     * @return bool
     */
    FlashMessages.prototype.registerScope = function($scope){
        if(this._findScope($scope) === null){
            var self = this;
            var unbind = $scope.$on('$destroy', function(){
                self.removeScope($scope);
            });
            
            this._scopes.push({
                scope: $scope,
                unbind: unbind
            });
            
            return true;
        }
        return false;
    };
    
	return new FlashMessages();
}]);