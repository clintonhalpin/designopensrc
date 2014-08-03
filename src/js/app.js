'use strict';

(function () {

  function Auth($firebase, $firebaseSimpleLogin, $q, $timeout) {
    var ref = new Firebase("https://popping-fire-1726.firebaseio.com/");
    var simpleLogin = $firebaseSimpleLogin(ref);

    var getCurrentUser = function() {
      var deferred = $q.defer();

      simpleLogin.$getCurrentUser()
      .then(function(user) {
        if ( user ) {
          deferred.resolve(user);
        } else {
          return false 
        }
      });

      return deferred.promise;
    };

    var logout = function() {
      simpleLogin.$logout();
    }

    var login = function() {
      var deferred = $q.defer();

      simpleLogin.$login( 'github' )
      .then(function(user) {
        if ( user ) {
          deferred.resolve(user);
        } else {
          return false 
        }
      });

      return deferred.promise;
    };


    return {
      getCurrentUser : getCurrentUser,
      logout : logout,
      login : login
    };
  }

  function indexCtrl( $scope, $state, Auth, $firebase, $firebaseSimpleLogin ) {
    this.name = "Design Open Src";
    this.currentUser = false;

    Auth.getCurrentUser().then(function(user) {
      $scope.currentUser = user;
    });

    this.logout = function() {
      Auth.logout();
      $state.go($state.current, {}, {reload: true});  
    }

    this.login = function() {
      Auth.login().then(function(user) {
        $scope.currentUser = user;
        console.log(user)
      });
    }

  }

  function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/")
    $stateProvider
    .state('index', {
      url: "/",
      templateUrl: 'components/index/index.html',
      controller: 'indexCtrl',
      controllerAs: 'ctrl'
    })
  }

  var app = angular.module('app', ['ui.router', 'firebase' ]);

  app.config(config);
  app.controller('indexCtrl', indexCtrl, [ 'Auth' ]);
  app.service('Auth', Auth, [ '$firebase', '$firebaseSimpleLogin' ]);

})();
