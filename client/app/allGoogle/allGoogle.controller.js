'use strict';

angular.module('newsApp')
  .controller('AllgoogleCtrl', function ($scope, $http) {
    $scope.newsData = [];
    $scope.myData = [10,20,30,40,60, 80, 20, 50];
    $scope.chart = null;
    $http.get('/api/gTrends/getTrends').success(function(data){
      $scope.trendsArr = data;
      console.log($scope.trendsArr);
    });
    this.getNews = function(obj) {
      $http.post('/api/gNews/getArticle', obj).success(function(data){
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
  })
  .directive('wiki', function() {
    return {
      scope: false,
      restrict: 'E',
      template: '<p>Context:</p>',
      link: function(scope, element, attrs){
        element.append(scope.newsData[10].context);
      }
    };
  })
  .directive('barsChart', function($parse) {
    //explicitly creating a directive definition variable
    //this may look verbose but is good for clarification purposes
    //in real life you'd want to simply return the object {...}
    return {
      //We restrict its use to an element
      //as usually  <bars-chart> is semantically
      //more understandable
      restrict: 'E',
      //this is important,
      //we don't want to overwrite our directive declaration
      //in the HTML mark-up
      replace: false,
      //our data source would be an array
      //passed thru chart-data attribute
      scope: {
        data: '=chartData'
      },
      link: function(scope, element, attrs) {
        //in D3, any selection[0] contains the group
        //selection[0][0] is the DOM node
        //but we won't need that this time
        var chart = d3.select(element[0]);
        //to our original directive markup bars-chart
        //we add a div with out chart stling and bind each
        //data entry to the chart
        chart.append('div').attr('class', 'chart')
          .selectAll('div')
          .data(scope.data).enter().append('div')
          .transition().ease('elastic')
          .style('width', function(d) {
            return d + '%';
          })
          .text(function(d) {
            return d + '%';
          });
        //a little of magic: setting it's width based
        //on the data value (d)
        //and text all with a smooth transition
      } // closes link
    }; // closes directivedefobj
  }); // closes directive