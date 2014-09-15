'use strict';

angular.module('newsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('trends', {
        url: '/trends',
        templateUrl: 'app/trends/trends.html',
        controller: 'TrendsCtrl',
        controllerAs: 'trends'
      });
  });