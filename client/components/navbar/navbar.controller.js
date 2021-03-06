'use strict';

angular.module('newsApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Main',
      'link': '/'
      }, {
      'title': 'Home',
      'link': '/home'
      },{
      'title': 'Trends',
      'link': '/trends'
      }, {
      'title': 'Google News',
      'link': '/allGoogle'
      }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });