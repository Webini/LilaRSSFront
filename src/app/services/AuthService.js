angular.module('lilarss')
       .service('AuthService', [ '$http', '$q', '$rootScope', function($http, $q, $rootScope){
    var self          = this;
    this.user         = null;
    this.renewTimeout = null;
    this.renewPromise = null;
    
    /**
     * REtreive user from localStorage
     * @return {undefined}
     */
    this._popUser = function(){
        try{
            this.user = JSON.parse(window.localStorage.getItem('user'));
            
            if((typeof this.user.expires) === 'string'){
                this.user.expires = new Date(this.user.expires);
            }
        }
        catch(e){
            this.user = null;
        }
    };
    
    /**
     * Retreive logged user
     * @return {object}
     */
    this.getLoggedUser = function(){
        return this.user;
    };
    
    /**
     * Register an user
     * @return {promise}
     */
    this.register = function(user){
        return $http.post('/user/create', user).then(
            function(resp){
                return resp.data;
            },
            function(resp){
                return $q.reject(resp.data);
            }
        );
    };
    
    /**
     * Define logged user
     * @param {object} user
     * @return self
     */
    this._setUser = function(user){
        if(user && (typeof user.expires) === 'string'){
            user.expires = new Date(user.expires);
        }
        
        this.user = user;
        window.localStorage.setItem('user', JSON.stringify(this.user));
    };
    
    /**
     * Log user
     * @return promise
     */
    this.login = function(email, password, rememberMe){
        return $http.post('/auth/login', { email: email, password: password, remember: rememberMe}).then(
            function(resp){
                self._setUser(resp.data);  
                self._bindRenewTimer();  
                return resp.data;
            },
            function(resp){
                self._setUser(null);
                return $q.reject(resp.data);
            }
        )
        
    };
    
    /**
     * Renew token
     * @return promise
     */
    this.renewToken = function(){
        if(this.renewPromise){
            return this.renewPromise;
        }
        
        $rootScope.$emit('$authRenewTokenStart');
        
        this.renewPromise = $http.post('/auth/renew', { token: this.user.token, renewKey: this.user.renewKey }).then(
            function(res){
                self._setUser(res.data);
                self._bindRenewTimer();
                self.renewPromise = null;
                $rootScope.$emit('$authRenewTokenEnd', true);
                return res.data;
            },
            function(res){
                $rootScope.$emit('$authRenewTokenEnd', false);
                self._setUser(null);
                self.renewPromise = null;
                return $q.reject(res.data);
            }
        );
        
        return this.renewPromise;
    };
     
    /**
     * Put a timer for renewing auth key
     * @return {undefined}
     */
    this._bindRenewTimer = function(){
        if(this.renewTimeout){
            clearTimeout(this.renewTimeout);
        }
        
        if(!this.isRenewableToken()){
            return;
        }
        
        this.renewTimeout = setTimeout(function(){
            self.renewTimeout = null;
            self.renewToken();
        }, this.user.expires.getTime() - (new Date()).getTime() - 60000);
    };
     
    /**
     * Check if current user can renew his token
     * @return promise;
     */
    this.isRenewableToken = function(){
        return (this.user && this.user.renewKey);
    }
    
    /**
     * Check if user is authenticated
     * @return {boolean}
     */
    this.isAuthenticated = function(){
        if(this.user === null){
            return false;
        }    
        
        return (new Date() < this.user.expires);
    };
    
    this._popUser();
    this._bindRenewTimer();
}]);