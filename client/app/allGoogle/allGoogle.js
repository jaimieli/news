'use strict';

angular.module('newsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('allGoogle', {
        url: '/',
        templateUrl: 'app/allGoogle/allGoogle.html',
        controller: 'AllgoogleCtrl',
        controllerAs: 'google'
      });
  });