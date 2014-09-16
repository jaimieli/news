'use strict';

angular.module('newsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('allGoogle', {
        url: '/allGoogle',
        templateUrl: 'app/allGoogle/allGoogle.html',
        controller: 'AllgoogleCtrl',
        controllerAs: 'google'
      });
  });