'use strict';

angular.module('newsApp')
  .controller('AllgoogleCtrl', function ($scope, $http) {
    $scope.myData = [10,20,30,40,60, 80, 20, 50];
    $scope.exampleData = [
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
    $scope.yFunction = function() {
      return function(d) {
        return d.y;
      };
    }
    $scope.xFunction = function() {
      return function(d) {
        return d.x;
      };
    }
    $scope.chart = null;
    $http.get('/api/gTrends/getTrends').success(function(data){
      $scope.trendsArr = data;
      console.log($scope.trendsArr);
    });
    this.getNews = function(obj) {
      $http.post('/api/gNews/getArticle', obj).success(function(data){
        $scope.newsData = data;
        // mapping data to display in chart
        $scope.newsData.display = [];
        for (var i=0; i<$scope.newsData.sentimentData.length; i++) {
          var groupObj = {};
          groupObj['key'] = $scope.newsData.sentimentData[i].entity;
          groupObj['values'] = [];
          $scope.newsData.sentimentData[i].sentimentScores.forEach(function(outlet){
            var sentimentObj = {};
            sentimentObj['x'] = outlet.score;
            sentimentObj['y'] = i + 1;
            sentimentObj['size'] = 0.5;
            groupObj['values'].push(sentimentObj);
          })
          $scope.newsData.display.push(groupObj)
        }
        // end of mapping data to display in chart
        console.log($scope.newsData);
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
        element.append(scope.newsData.cleanData[10].context);
      }
    };
  })
  .directive('barsChart', function($parse) {
    return {
      restrict: 'E',
      replace: false,
      //our data source is an an array
      //passed through chart-data attribute
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
        //set its width based
        //on the data value (d)
        //and text all with a smooth transition
      } // closes link
    }; // closes directivedefobj
  }); // closes directive