'use strict';

angular.module('newsApp')
  .controller('HomeCtrl', function ($scope, $http, socket, $location) {
    $scope.toolTipContentFunction = function(){
      return function(key, x, y, e, graph) {
          return  'Super New Tooltip' +
              '<h1>' + key + '</h1>' +
                '<p>' +  y + ' at ' + x + '</p>'
      }
    }
    $scope.xAxisTickFormatFunction = function(){
    return function(d){
        return d3.time.format('%b')(new Date(d));
    }
}
    $scope.exampleData2 = {
      "title": "Revenue",
      "subtitle": "US$, in thousands",
      "ranges": [-1, 1],
      "measures": [-0.5, 0.8],
      "markers": [.6]
    }
     $scope.exampleData3 = [
                {
                  "key": "Series 1",
                  "values": [
                    ["Jam", 1],
                    ["Jam", 3],
                    ["Jam", -2]
                  ]
                }
            ];
    $scope.exampleData = [
      {
          "key": "Negative",
          "color": "#d62728",
          "values": [
            ["Group A" , -1.8746444827653, "D"],

            ["Group C" , -0.57072943117674, "D"],

            ["Group E" , -0.72009071426284, "D"],

            ["Group G" , -0.90152097798131, "D"],

            ["Group I" , -0.055746319141851, "D"]
          ]
      },
      {
          "key": "Positive",
          "color": "#1f77b4",
          "values": [

              ["Group B" , 16.756779544553, "D"],

              ["Group D" , 8.6142352811805, "D"],

              ["Group F" , 5.259101026956],

              ["Group H" , 0],

          ]
      }
    ];
    $scope.tabs = [
        { title:'Dynamic Title 1', content:'Dynamic content 1' },
        { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
      ];
    this.newArticle = {};
    $http.get('/api/articles').success(function(data){
      $scope.articles = data;
      socket.syncUpdates('article', $scope.articles);
    });
    // $http.get('/api/sentiments/getArticles').success(function(data){
    //   $scope.allArticles = data;
    //   console.log(data);
    // })
    // $http.get('/api/twitters/search').success(function(data){
    //   console.log(data);
    // })
    this.twitter = function() {
      $http.get('/api/twitters/2459115').success(function(data){
        console.log(data);
      });
    };
    this.twitterStream = function() {
      $http.post('/api/twitters/search', {query: 'Jameis Winston'}).success(function(data){
        $scope.twitterData = [];
        socket.syncUpdates('twitter', $scope.twitterData);


        // console.log('scope twitter data: ', $scope.twitterData.length);
      })
    }
    this.gTrends = function() {
      $http.get('/api/gTrends/getTrends').success(function(data){
        console.log(data);
      })
    }
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
      console.log(article);
      $http.post('/api/sentiments/getEntities', article).success(function(data) {
        console.log(data);
      });
    };
    this.showSentiments = function(article){
      article.sentiment = 1;
      console.log(article);
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