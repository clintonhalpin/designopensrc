'use strict';

(function () {

  function Sync($firebase) {
    var data = new Firebase("https://popping-fire-1726.firebaseio.com/publicData");
    var sync = $firebase(data);
    return sync;
  }

  function Auth($firebase, $firebaseSimpleLogin) {
    var ref = new Firebase("https://popping-fire-1726.firebaseio.com/");
    return $firebaseSimpleLogin(ref);
  }

  function indexCtrl( $scope, $state, Auth, currentUser, Sync) {
    this.name = "Design Open Src";
    this.auth = Auth; 
    $scope.users = Sync.$asArray();
    console.log($scope.sync);


  
    
    this.login = function() {
      this.auth.$login('github')
      .then(function(user) {
        console.log(user);
        $scope.users.$add({ 
          "uid" : user.uid,
          "data" : user.thirdPartyUserData
        });
      });
    }

    this.logout = function() {
      this.auth.$logout(); 
    }
  }

  function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/")
    $stateProvider
    .state('index', {
      url: "/",
      templateUrl: 'components/index/index.html',
      controller: 'indexCtrl',
      controllerAs: 'ctrl',
      resolve: {
        "currentUser": ["Auth", function(Auth) {
          return Auth.$getCurrentUser();
        }]
      }
    })
  }

  var app = angular.module('app', ['ui.router', 'firebase' ]);

  app.config(config);
  app.controller('indexCtrl', indexCtrl, [ 'Auth' ]);
  app.factory('Auth', Auth, [ '$firebase', '$firebaseSimpleLogin' ]);
  app.factory('Sync', Sync, [ '$firebase' ]);
})();
