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
    $scope.exampleData4 = [
      {"key": "Group 0",
        "values":[{"x":0.1905653578931545,"y":0.8115218253543552,"size":0.3461829945445061},{"x":-0.47275546081985614,"y":-0.21250610156481783,"size":0.7597237343434244},{"x":-0.5943608400643436,"y":0.48326260219425793,"size":0.02735756477341056},{"x":0.4529497407477123,"y":-0.2613829468206304,"size":0.946700036060065},{"x":-0.7679040328935364,"y":-1.586936005594271,"size":0.43301939661614597},{"x":-1.5731902534071192,"y":-0.09195950915659948,"size":0.4368209659587592},{"x":0.05553592818277685,"y":1.742933013062792,"size":0.8306681548710912},{"x":1.1877814988973527,"y":-1.3711119089602777,"size":0.8269749800674617},{"x":0.3064363198255656,"y":-1.667839553436299,"size":0.12198411440476775},{"x":-1.8983536631939086,"y":-0.30140817421374505,"size":0.9157399751711637}]
      },
      {"key": "Group 1",
        "values":[{"x":1.4653418686067552,"y":0.7410516592097678,"size":0.9255829956382513},{"x":-0.02877491536521995,"y":0.5971477723050743,"size":0.20799188618548214},{"x":0.39933969151296006,"y":-0.16091907790207202,"size":0.5916927580256015},{"x":0.2577554231630996,"y":-0.9577460957918283,"size":0.5138049270026386},{"x":-2.3221649907829915,"y":-0.0044684970626760615,"size":0.34789505670778453},{"x":0.2858384580920749,"y":-0.009337575343956525,"size":0.393431298667565},{"x":0.9539376373228463,"y":-1.0195667080212654,"size":0.7679041607771069},{"x":-1.2227832080343977,"y":-1.6489586214792973,"size":0.054216297809034586},{"x":1.9630250651259868,"y":1.1245000954887443,"size":0.5867844161111861},{"x":1.884517259998223,"y":1.6812398769521144,"size":0.7839774377644062}]
      },
      {"key": "Group 2",
        "values":[{"x":0.0013830897746349158,"y":0.8497943642692461,"size":0.9310796288773417},{"x":-0.9537010017212795,"y":-1.1938008511904343,"size":0.05539561901241541},{"x":-1.0580424236734207,"y":2.139854471729741,"size":0.48268040106631815},{"x":0.043968415027694996,"y":0.8852129039510529,"size":0.3477212116122246},{"x":1.7055412152062768,"y":-1.4348212323474745,"size":0.9668007399886847},{"x":0.9397547265176092,"y":-0.07296315663759684,"size":0.9410439992789179},{"x":0.19021526090792454,"y":-1.050431710977525,"size":0.3422081198077649},{"x":-0.7558508461125094,"y":-0.17196373499775727,"size":0.8589865525718778},{"x":1.3230960643052652,"y":-0.30467315468255535,"size":0.12701098946854472}]
      },
      {"key": "Group 3",
        "values":[{"x":0.08977024155251706,"y":-1.4315520281419063,"size":0.6179190273396671},{"x":0.11861503770586883,"y":0.23955359638861132,"size":0.25821112329140306},{"x":-1.0237018995145157,"y":-0.5612582258175013,"size":0.1404807132203132},{"x":-0.9393455408596457,"y":0.6737660860684879,"size":0.9703105506487191},{"x":0.19159941945806783,"y":-0.8725095986814769,"size":0.43511714902706444},{"x":1.6895418516897702,"y":0.32170365030040016,"size":0.8828782043419778},{"x":0.4842324641678769,"y":0.5980015980942737,"size":0.8117240949068218},{"x":-0.011520241595057892,"y":0.1074086719509541,"size":0.35458783572539687},{"x":-0.9232625281509388,"y":-1.376116962711894,"size":0.26924173487350345},{"x":-0.3926740679388665,"y":-0.0295550635718949,"size":0.2515628270339221}]
      }
    ];
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