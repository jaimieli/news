'use strict';

angular.module('newsApp')
  .controller('AllgoogleCtrl', function ($scope, $http, socket, $sanitize, $sce) {
    $scope.sourceModel = [];
    $scope.entityModel = [];
    $http.get('/api/gTrends/getTrends').success(function(data){
      // data.forEach(function(el){
      //   el.property2 = parseInt(el.property2)*1000;
      // })
      $scope.trendsArr = data;

      console.log($scope.trendsArr);
    });
    // setting views for single display page
    $scope.clickOverall = function(){
      $scope.displayOverall = true;
      $scope.displayAnalysis = false;
      $scope.displayContext= false;
      $scope.displayArticles = false;
      $scope.displayAnalysis2 = false;
    };
    $scope.clickAnalysis = function(){
      $scope.displayOverall = false;
      $scope.displayAnalysis = true;
      $scope.displayContext= false;
      $scope.displayArticles = false;
      $scope.displayAnalysis2 = false;
    };
    $scope.clickAnalysis2 = function() {
      $scope.displayOverall = false;
      $scope.displayAnalysis = false;
      $scope.displayContext= false;
      $scope.displayArticles = false;
      $scope.displayAnalysis2 = true;
    }
    $scope.clickContext = function() {
      $scope.displayOverall = false;
      $scope.displayAnalysis = false;
      $scope.displayContext= true;
      $scope.displayArticles = false;
      $scope.displayAnalysis2 = false;
    }
    $scope.clickArticle = function() {
      $scope.displayArticles = true;
      $scope.displayOverall = false;
      $scope.displayAnalysis = false;
      $scope.displayContext= false;
      $scope.displayAnalysis2 = false;
    }
    // end of setting views for single display page
    $scope.getTwitter = function(obj){
      $http.post('/api/twitters/search', obj).success(function(data){
        console.log(data);
        $scope.twitterStream = data;
        socket.syncUpdates('twitter', $scope.twitterStream)
      })
    }
    $scope.fullObj = {externalIdProp: ''};
    $scope.entityCustomTexts = {buttonDefaultText: 'Select Entities'}
    $scope.sourceCustomTexts = {buttonDefaultText: 'Select Sources'}
    $scope.toolTipBarChartContentFunction = function(){
      return function(key, x, y, e, graph) {
          return '<p>' + y + '</p>'
      }
    }
    $scope.barChartxAxisTickFormatFunction = function(){
      return function() {
        "";
      }
    }
    $scope.myData = [10,20,30,40,60, 80, 20, 50];
    $scope.fakeData = [
      {"key": "Group 0",
      "values":[{"x":0.1905653578931545,"y":1,"size":0.3461829945445061},{"x":-0.47275546081985614,"y":1,"size":0.7597237343434244}]
      },
      {"key": "Group 2",
        "values":[{"x":0.1905653578931545,"y":2,"size":0.3461829945445061},{"x":-0.47275546081985614,"y":2,"size":0.7597237343434244}]
      },
      {"key": "Group 3",
        "values":[{"x":0.1905653578931545,"y":3,"size":0.3461829945445061},{"x":-0.47275546081985614,"y":3,"size":0.7597237343434244}]
      },
      {"key": "Group 4",
        "values":[{"x":0.1905653578931545,"y":4,"size":0.3461829945445061},{"x":-0.47275546081985614,"y":4,"size":0.7597237343434244}]
      },
      {"key": "Group 5",
        "values":[{"x":0.1905653578931545,"y":5,"size":0.3461829945445061},{"x":-0.47275546081985614,"y":5,"size":0.7597237343434244}]
      },
      {"key": "Group 6",
        "values":[{"x":0.1905653578931545,"y":6,"size":0.3461829945445061},{"x":-0.47275546081985614,"y":6,"size":0.7597237343434244}]
      },
      {"key": "Group 7",
        "values":[{"x":0.1905653578931545,"y":7,"size":0.3461829945445061},{"x":-0.47275546081985614,"y":7,"size":0.7597237343434244}]
      },
      {"key": "Group 8",
        "values":[{"x":0.1905653578931545,"y":8,"size":0.3461829945445061},{"x":-0.47275546081985614,"y":8,"size":0.7597237343434244}]
      },
      {"key": "Group 9",
        "values":[{"x":0.1905653578931545,"y":8,"size":0.3461829945445061},{"x":-0.47275546081985614,"y":8,"size":0.7597237343434244}]
      }
    ];

    // $scope.tooltipYContentFunction = function(){
    //     return function(key, x, y) {
    //         return '<strong>YO!' + y + '</strong>'
    //     }
    // }
    // $scope.stopStream = function(){
    //   console.log("sending get to backend to stop stream");
    //   $http.get('api/twitters/destroy').success(function(){
    //     console.log('destroyed stream');
    //   })
    //   $scope.twitterData = [];
    // }
    // $scope.allSelected = false;

    // $scope.selectText = "Select All";
    $scope.tooltipXContentFunction = function(){
        return function ( key, x, y ) {
          return '<strong>' + x + '</strong>'
        }
    };
    $scope.tooltipContentFunction2 = function(){
      return function(key, x, y){
        return '<strong>' + y + '</strong>: ' +
                '<strong>' + x + '</strong>'
      }
    };
    $scope.yAxisFormatFunction = function() {
      return function(y){
        return $scope.newsData.entitiesIndex[y-1]
      }
    }
    $scope.yAxisFormatFunction2 = function() {
      return function(y){
        return ""
      }
    }
    // clicked
    $scope.selectAllSources = function() {
      $scope.allSourcesSelected = !$scope.allSourcesSelected;
      if ($scope.allSourcesSelected) {
        $scope.selectSourcesText = "Deselect All";
        $scope.newsData.sources.forEach(function(el){
          if (el.selected === false || el.selected === undefined) {
            $scope.clicked(el);
          }
        })
      } else {
        $scope.selectSourcesText = "Select All";
        $scope.newsData.sources.forEach(function(el){
          if (el.selected === true) {
            $scope.clicked(el);
          }
        })
      }
    }
    $scope.selectAllTypes = function() {
      $scope.allTypesSelected = !$scope.allTypesSelected;
      if ($scope.allTypesSelected) {
        $scope.selectTypesText = "Deselect All";
        $scope.newsData.sentimentTypes.forEach(function(el){
          if (el.selected === false || el.selected === undefined) {
            $scope.clicked(el);
          }
        })
      } else {
        $scope.selectTypesText = "Select All";
        $scope.newsData.sentimentTypes.forEach(function(el){
          if (el.selected === true) {
            $scope.clicked(el);
          }
        })
      }
    }
    // clicked2
    $scope.selectAllEntities = function() {
      $scope.allEntitiesSelected = !$scope.allEntitiesSelected;
      console.log('$scope.allEntitiesSelected: ', $scope.allEntitiesSelected)
      if ($scope.allEntitiesSelected) {
        console.log('all entities true')
        $scope.selectEntitiesText = "Deselect All";
        $scope.newsData.entities.forEach(function(el){
          if(el.selected2 === false || el.selected2 === undefined) {
            $scope.clicked2(el);
          }
        })
      } else {
        console.log('all entities false')
        $scope.selectEntitiesText = "Select All";
        $scope.newsData.entities.forEach(function(el){
          if(el.selected2 === true) {
            $scope.clicked2(el);
          }
        })
      }
    }
    $scope.selectAllTypes2 = function() {
      $scope.allTypesSelected2 = !$scope.allTypesSelected2 ;
      console.log('selectAllTypes2 after switch: ', $scope.allTypesSelected2);
      if ($scope.allTypesSelected2) {
        console.log('selected 2 true')
        $scope.selectTypesText2 = "Deselect All";
        $scope.newsData.sentimentTypes.forEach(function(el){
          if (el.selected2 === false || el.selected2 === undefined) {
            $scope.clicked2(el);
          }
        })
      } else {
        console.log('selected 2 false')
        $scope.selectTypesText2 = "Select All";
        $scope.newsData.sentimentTypes.forEach(function(el){
          if (el.selected2 === true) {
            $scope.clicked2(el);
          }
        })
      }
    }
    $scope.selected = function(outlet) {
      return($scope.sourcesArr.indexOf(outlet.href) == -1);
    }
    $scope.clicked = function(thing) {
      $scope.sourceChosen = 0;
      $scope.typeChosen = 0;
      $scope.sourcesArr = [];
      var typesArr = [];
      if(thing.selected === false || thing.selected === undefined){
        thing.selected = true;
      } else {
        thing.selected = false;
      }
      $scope.newsData.sources.forEach(function(el){
        if (el.selected === true) {
          $scope.sourceChosen++;
          $scope.sourcesArr.push(el.label);
          $scope.newsData.cleanData.forEach(function(element) {
            if (element.href === el.label) {
              element.selected = true;
            }
          })
        }
        if (el.selected === false) {
          $scope.newsData.cleanData.forEach(function(element) {
            if (element.href === el.label) {
              element.selected = false;
            }
          })
        }
      })
      console.log('cleanData: ', $scope.newsData.cleanData);
      // console.log('sources: ', $scope.newsData.sources);
      $scope.newsData.sentimentTypes.forEach(function(el){
        if (el.selected === true) {
          $scope.typeChosen++;
          typesArr.push(el.type);
        }
      })
      // console.log('types: ', $scope.newsData.sentimentTypes);
      // console.log('$scope.typeChosen: ', $scope.typeChosen);
      // $scope.newsData.entities.forEach(function(el){
      //   if (el.selected === true) {
      //     $scope.entityChosen++;
      //     entitiesArr.push(el.label);
      //   }
      // })
      // console.log('entities: ', $scope.newsData.entities)
      // console.log('$scope.entityChosen: ', $scope.entityChosen);
      // console.log('$scope.sourceChosen: ', $scope.sourceChosen);
      if ($scope.sourceChosen > 0 && $scope.typeChosen > 0) {
        // filter by source
        var newsDataNotFilteredArr = $scope.newsData.display;
        var newsDataFilteredArr = [];
        for (var i = 0; i < newsDataNotFilteredArr.length; i++) {
          var unFilteredSrcArr = newsDataNotFilteredArr[i].values;
          var filteredSrcArr = unFilteredSrcArr.filter(function(src) {
            if ($scope.sourcesArr.indexOf(src.source) !== -1 && typesArr.indexOf(src.type) !== -1) {
              return src;
            }
          });

          var newObj = {
            key: newsDataNotFilteredArr[i].key,
            values: filteredSrcArr
          };
          if (newObj.values.length !== 0){
            newsDataFilteredArr.push(newObj);
          }
        } // closes for loop
        // console.log('after source filter: ', newsDataFilteredArr)
        // // filter by entities
        $scope.newsData.d3 = [];
        // var filteredFinal = [];
        // console.log('entities array: ', entitiesArr);
        // console.log('newsDataFilteredArr: ', newsDataFilteredArr)
        // for (var i = 0; i < newsDataFilteredArr.length; i++){
        //   var filteredFinal = newsDataFilteredArr.filter(function(el){
        //     if(entitiesArr.indexOf(el.key) !== -1) {
        //       return el;
        //     }
        //   });
        // } // closes for loop
        // console.log('filteredFinal: ', filteredFinal);
        $scope.newsData.d3 = newsDataFilteredArr;
        // $scope.newsData.d3 = filteredFinal;
      } // closes if
      else {
        $scope.newsData.d3 = [];
      }
      console.log('newsData: ', $scope.newsData);
      console.log('$scope.sourcesArr: ', $scope.sourcesArr);
    }

    $scope.clicked2 = function(thing) {
      $scope.entityChosen = 0;
      $scope.typeChosen2 = 0;
      $scope.entitiesArr = [];
      var typesArr2 = [];
      if(thing.selected2 === false || thing.selected2 === undefined){
        thing.selected2 = true;
      } else {
        thing.selected2 = false;
      }
      $scope.newsData.entities.forEach(function(el){
        if (el.selected2 === true) {
          $scope.entityChosen++;
          $scope.entitiesArr.push(el.label);
        }
      })
      $scope.newsData.sentimentTypes.forEach(function(el){
        if (el.selected2 === true) {
          $scope.typeChosen2++;
          typesArr2.push(el.type);
        }
      })
      console.log('$scope.entitiesArr: ', $scope.entitiesArr);
      console.log('typesArr2: ', typesArr2);
      if($scope.entityChosen > 0 && $scope.typeChosen2 > 0) {
        var notFilteredArr = $scope.newsData.display2;
        var newsFilteredArr = [];
        for (var i = 0; i < notFilteredArr.length; i++) {
          var unFilteredArr = notFilteredArr[i].values;
          var filteredArr = unFilteredArr.filter(function(src){
            console.log('$scope.entitiesArr: ', $scope.entitiesArr)
            console.log('src.entity: ', src.entity);
            console.log('typesArr2: ', typesArr2);
            console.log('src.type: ', src.type);
            if($scope.entitiesArr.indexOf(src.entity) !== -1 && typesArr2.indexOf(src.type) !== -1) {
              return src;
            }
          })
          var newObj2 = {
            key: notFilteredArr[i].key,
            values: filteredArr
          };
          // if (newObj2.values.length !== 0){
          //   newsFilteredArr.push(newObj2);
          // }
          newsFilteredArr.push(newObj2);
        }
        $scope.newsData.d3_2 = [];
        $scope.newsData.d3_2 = newsFilteredArr;
      }
      console.log('newsData: ', $scope.newsData);
    }
    $scope.resetSourceFilters = function() {
      angular.forEach($scope.newsData.sources, function(el){
        el.selected=false;
      })
    }

    $scope.resetEntityFilters = function() {
      angular.forEach($scope.newsData.entities, function(el){
        el.selected=false;
      })
    }
    var sourceFilteredArr = [];

    $scope.chart = null;
    $scope.displayAll = true;
    $scope.setDisplay = function(){
      console.log('setting display to ')
      $scope.displayAll = true;
      console.log("sending get to backend to stop stream");
      $http.get('api/twitters/destroy').success(function(){
        console.log('destroyed stream');
      })
      $scope.twitterData = [];
      $scope.newsData = {};
    }
    this.getNews = function(obj) {
      $scope.showTransition = true;
      $scope.displayAll = false;
      $http.post('/api/twitters/search', obj).success(function(data){
        $scope.twitterData = [];
        socket.syncUpdates('twitter', $scope.twitterData);
        // console.log('scope twitter data: ', $scope.twitterData.length);
      })
      $http.post('/api/gNews/getArticle', obj).success(function(data){
        $scope.newsData = data;
        // wiki data
        $scope.newsData.wikiClean = $sce.trustAsHtml($scope.newsData.wiki[0].context);
        // console.log('wikiClean: ', $scope.newsData.wikiClean);
        // if ($scope.newsData.wikiClean === 'Not Available') {
        //   $scope.displayWiki = false
        // } else {
        //   $scope.displayWiki = true;
        // }
        // console.log('displayWiki: ', $scope.display);
        // setting undefined doc sentiment scores to unavailable
        $scope.newsData.cleanData.forEach(function(outlet){
          if (outlet.docSentiment === "undefined") {
            outlet.docSentiment === "Unavailable";
          }
        })
        // mapping data to display in horizontal bar chart
        $scope.newsData.barChart =  [];
        var negObj = {'key': 'Negative', 'color': '#d62728'};
        var posObj = {'key': 'Positive', 'color': '#1f77b4'};

        var negValues = [];
        var posValues = [];
        // iterate through docSentiment here
        $scope.newsData.sources.forEach(function(el){
          var valArr = []
          if (el.docSentiment < 0) {
            valArr.push(el.docSentiment);
            valArr.push(el.cleanLabel);
            valArr.push(el.label)
            negValues.push(valArr);
          } else {
            valArr.push(el.docSentiment);
            valArr.push(el.cleanLabel);
            valArr.push(el.label);
            posValues.push(valArr);
          }
        })
        var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

        var counter = 0;
        negValues.forEach(function(el){
          el.unshift(alphabet[counter]);
          counter++;
        })

        posValues.forEach(function(el){
          el.unshift(alphabet[counter]);
          counter++;
        })

        negObj['values'] = negValues;
        posObj['values'] = posValues;

        $scope.newsData.barChart.push(negObj);
        $scope.newsData.barChart.push(posObj);
        // mapping data to display in scatter chart (group by source)
        $scope.newsData.display2 = [];

        $scope.newsData.entitiesIndex = [];
        $scope.newsData.sentimentData.forEach(function(el){
          $scope.newsData.entitiesIndex.push(el.entity);
        })

        $scope.newsData.cleanData.forEach(function(source){
          var sourceObj = {};
          sourceObj['key'] = source.cleanLabel;
          sourceObj['values'] = [];
          sourceObj['checked'] = false;
          source.entitySentiment.forEach(function(entity){
            if ($scope.newsData.entitiesIndex.indexOf(entity.entity) !== -1) {
              var entityObj = {};
              entityObj['y'] = $scope.newsData.entitiesIndex.indexOf(entity.entity) + 1;
              entityObj['x'] = entity.score;
              entityObj['size'] = entity.frequency;
              entityObj['entity'] = entity.entity;
              entityObj['type'] = entity.type;
              sourceObj['values'].push(entityObj);
            }
          })
          $scope.newsData.display2.push(sourceObj);
        })

        // mapping data to display in scatter chart
        $scope.newsData.display = [];
        $scope.newsData.entities = [];

        var counter = 1;
        for (var i=0; i<$scope.newsData.sentimentData.length; i++) {
          // newsData.entities data for dropdown
           var entityObj = {};
          entityObj['id'] = counter;
          entityObj['label'] = $scope.newsData.sentimentData[i].entity;
          $scope.newsData.entities.push(entityObj);
          counter++;
          // end of newsData.entities data for dropdown
          // beginning of newsData.display data for charts
          var groupObj = {};
          groupObj['key'] = $scope.newsData.sentimentData[i].entity;
          groupObj['values'] = [];
          groupObj['checked'] = false;
          $scope.newsData.sentimentData[i].sentimentScores.forEach(function(outlet){
            var sentimentObj = {};
            sentimentObj['x'] = outlet.score;
            sentimentObj['y'] = i + 1;
            // set size of circle to the frequency of the word being mentioned
            sentimentObj['size'] = outlet.frequency;
            sentimentObj['source'] = outlet.source;
            sentimentObj['type'] = outlet.type;
            groupObj['values'].push(sentimentObj);
          })
          $scope.newsData.display.push(groupObj)
          $scope.newsData.sentimentTypes = [
              {type: 'positive'},
              {type: 'neutral'},
              {type: 'negative'}
            ];
        }
        // end of newsData.display data for charts
        // default: select all
        // angular.forEach($scope.newsData.sentimentTypes, function(el){
        //   $scope.clicked(el);
        // })
        // angular.forEach($scope.newsData.sources, function(el){
        //   $scope.clicked(el);
        // })
        $scope.allTypesSelected = false;
        $scope.allTypesSelected2 = false;
        $scope.allSourcesSelected = false;
        $scope.allEntitiesSelected = false;

        $scope.selectAllTypes();
        $scope.selectAllSources();
        $scope.selectAllEntities();
        $scope.selectAllTypes2();

        console.log($scope.newsData);
        $scope.showTransition = false;

        $scope.displayOverall = false;
        $scope.displayAnalysis = false;
        $scope.displayContext = false;
        $scope.displayArticles = true;
      });
    };
    this.showEntities = function(article) {
      console.log(article);
      $http.post('/api/gTrends/getEntities', article).success(function(data) {
        console.log(data);
      });
    };
    // $scope.clickedSource = function(source){
    //   if(typeof $scope.newsData.d3 === 'undefined') {
    //     $scope.newsData.d3 = [];
    //   }
    //   if(source.selected === false || source.selected === undefined){
    //     source.selected = true;
    //   } else {
    //     source.selected = false;
    //   }
    //   var sourcesArr = []
    //   $scope.newsData.sources.forEach(function(element){
    //     if(element.selected===true){
    //       sourcesArr.push(element.label);
    //     }
    //   })

    //   var newsDataNotFilteredArr = $scope.newsData.display;
    //   console.log("this is inside clicksource before filter: ", newsDataNotFilteredArr);

    //   var newsDataFilteredArr = [];

    //   for (var i = 0; i < newsDataNotFilteredArr.length; i++) {
    //     var unFilteredSrcArr = newsDataNotFilteredArr[i].values;
    //     var filteredSrcArr = unFilteredSrcArr.filter(function(src) {
    //       if (sourcesArr.indexOf(src.source) !== -1) {
    //         return src;
    //       }
    //     });

    //     var newObj = {
    //       key: newsDataNotFilteredArr[i].key,
    //       values: filteredSrcArr,
    //       selected: newsDataNotFilteredArr[i].selected
    //     };
    //     if (newObj.values.length !== 0){
    //       newsDataFilteredArr.push(newObj);
    //     }
    //   }
    //   console.log("after filter newsdatafileredarr", newsDataFilteredArr)
    //   sourceFilteredArr = newsDataFilteredArr;
    //   $scope.sourceFilteredArr = sourceFilteredArr;

    //   // $scope.newsData.d3 = $scope.newsData.display.map(function(entity){
    //   //   var filtered;
    //   //   var final = [];
    //   //   sourcesArr.forEach(function(url){
    //   //     // console.log('entity values', entity.values);
    //   //     filtered = entity.values.filter(function(el){
    //   //       return el.source === url;
    //   //     })
    //   //     final.push(filtered[0]);
    //   //   })
    //   //   entity.values = final;
    //   //   return entity;
    //   //   })

    //   // console.log("after filter:" ,$scope.newsData.d3);
    // }

    // $scope.clickedEntity = function(entity) {

    //   if(typeof $scope.newsData.d3 === 'undefined') {
    //     $scope.newsData.d3 = [];
    //   }
    //   if (entity.selected === false || entity.select === undefined){
    //     entity.selected = true;
    //     $scope.newsData.d3.push(entity);
    //     // sourceFilteredArr.forEach(function(el){
    //     //   if(el.key===entity.key){
    //     //     $scope.newsData.d3.push(el);
    //     //   }
    //     // })
    //   } else {
    //     entity.selected = false;
    //     var index;
    //     for(var i = 0; i <$scope.newsData.d3.length; i++){
    //       if($scope.newsData.d3[i].key===entity.key){
    //         index = i;
    //       }
    //     }
    //     $scope.newsData.d3.splice(index,1);
    //   }
    //   console.log('newsData.d3: ', $scope.newsData.d3);
    // }
  })
  .directive('wiki', function() {
    return {
      scope: false,
      restrict: 'E',
      template: '<h2>Context</h2>',
      link: function(scope, element, attrs){
        element.append(scope.newsData.wiki[0].context);
      } // link function
    }; // object
  }) // directive
  .directive('bubbleChart', function(){
    return {
      restrict: 'E',
      replace: false,
      scope: {
        data: '=displayData'
      },
      link: function(scope, element, attrs){
        var chart = d3.select(element[0]);

      }
    };
  })
  .directive('barsChart', function() {
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
  }) // closes directive
  .filter('htmlToPlainText', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
  })
  .filter('reverse', function() {
    return function(items){
      return items.slice().reverse();
    };
  })