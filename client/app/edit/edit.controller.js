'use strict';

angular.module('newsApp')
  .controller('EditCtrl', function ($scope, $http, $location, $stateParams) {
    // submit article will update the existing article
    console.log($stateParams)
    var id = $stateParams.id;
    $http.get('/api/articles/' + id).success(function(data){
      $scope.obj = data;
    })
    this.submit = function(){
      $http.put('/api/articles/' + id, $scope.obj);
      // redirect to the home
      $location.path('/home');
    };
  });
