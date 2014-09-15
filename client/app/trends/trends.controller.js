'use strict';

angular.module('newsApp')
  .controller('TrendsCtrl', function ($scope, $http) {
    $scope.newsData = [];
    this.gTrends = function() {
      $http.get('/api/gTrends/getTrends').success(function(data){
        console.log(data);
      });
    };
    this.getNews = function(obj) {
      $http.post('/api/gTrends/getArticle', obj).success(function(data){
        $scope.newsData = data;
        console.log(data);
      });
    };
    this.showEntities = function(article) {
      console.log(article);
      $http.post('/api/gTrends/getEntities', article).success(function(data) {
        console.log(data);
      });
    };
    $http.get('/api/gTrends/getTrends').success(function(data){
      $scope.trendsArr = data;
      console.log($scope.trendsArr);
    });
  });
