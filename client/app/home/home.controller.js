'use strict';

angular.module('newsApp')
  .controller('HomeCtrl', function ($scope, $http, socket, $location) {
    this.newArticle = {};
    // $http.get('/api/articles').success(function(data){
    //   $scope.articles = data;
    //   socket.syncUpdates('article', $scope.articles);
    // });
    $http.get('/api/sentiments/getArticles').success(function(data){
      $scope.allArticles = data;
      console.log(data);
    })
    this.getUrls = function() {
      $http.get('https://www.kimonolabs.com/api/7nwv3q08?apikey=XNfUbBx4xGLryTCqJJgkamBOaa3v0wkj').success(function(data){
        console.log(data);
      })
    };
    this.submit = function(){
      if(this.newArticle === '') {
        return;
      }
      $http.post('/api/articles', this.newArticle);
      this.newArticle = '';
    };
    this.delete = function(article) {
      $http.delete('/api/articles/' + article._id);
    };
    this.edit = function(article){
      $location.path('/edit/'+article._id);
      // console.log(article);
    };
    this.showEntities = function(article) {
      $http.post('/api/sentiments/getEntities', article).success(function(data) {
        console.log(data);
      });
    };
    this.showSentiments = function(article){
       $http.post('/api/sentiments/getSentiments', article).success(function(data) {
        console.log(data);
      });
    };
    this.showText = function(article){
      $http.post('/api/sentiments/getText', article).success(function(data) {
        console.log('trying to show text');
        console.log(data);
      });
    };
    this.showAuthor = function(article){
      $http.post('/api/sentiments/getAuthor', article).success(function(data) {
        console.log('trying to show author');
        console.log(data);
      });
    };
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('article');
    });
  });